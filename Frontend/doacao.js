
const container = document.getElementById("forest-3d");
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
scene.background = new THREE.Color(0x87ceeb); // céu azul claro (inicial)
scene.fog = new THREE.Fog(0x87ceeb, 30, 150); // neblina a partir de 30 até sumir em 150
const arvoreList = []; // lista para armazenar referências

const GRASS_COUNT = 1000;
const grassGeometry = new THREE.PlaneGeometry(0.5, 1);
const grassMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22, side: THREE.DoubleSide });

const grassMesh = new THREE.InstancedMesh(grassGeometry, grassMaterial, GRASS_COUNT);
const dummy = new THREE.Object3D();

for (let i = 0; i < GRASS_COUNT; i++) {
    const x = Math.random() * 200 - 100;
    const z = Math.random() * 200 - 100;
    const y = 0;

    dummy.position.set(x, y, z);
    dummy.rotation.y = Math.random() * Math.PI;
    dummy.updateMatrix();
    grassMesh.setMatrixAt(i, dummy.matrix);
}

scene.add(grassMesh);


// Estrelas - criadas como pontos no céu
const starGeometry = new THREE.BufferGeometry();
const starCount = 400;
const starPositions = [];

for (let i = 0; i < starCount; i++) {
    const x = Math.random() * 400 - 200;
    const y = Math.random() * 200;
    const z = Math.random() * -200;
    starPositions.push(x + 150, y + 30, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));

const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.2,
    transparent: true,
    opacity: 0.8
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);
stars.visible = false; // invisível por padrão (dia)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

camera.position.set(0, 2, 80);
camera.lookAt(0, 0, 0);


let mouse = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };

// Captura a posição do mouse normalizada entre -1 e 1
window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Define a rotação alvo com base no movimento do mouse
    targetRotation.y = mouse.x * 0.2; // eixo horizontal
    targetRotation.x = mouse.y * 0.1; // eixo vertical
});

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(50, 50, 50);
scene.add(light);
scene.add(new THREE.AmbientLight(0x888888));

textureLoader.load('textures/grass.jpg', function (groundTexture) {
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(16, 16); // repete a textura no plano

    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);
});
scene.background = new THREE.Color(0x87ceeb);


function createTree(x = 0, z = 0) {
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(x, 2, z);

    const foliageGeometry = new THREE.ConeGeometry(2, 5, 8);
    const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.set(x, 6, z);

    scene.add(trunk);
    scene.add(foliage);

    arvoreList.push({ trunk, foliage });

}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    // Interpola suavemente a rotação da câmera
    camera.rotation.x += (targetRotation.x - camera.rotation.x) * 0.05;
    camera.rotation.y += (targetRotation.y - camera.rotation.y) * 0.05;
    stars.rotation.y += 0.0005;
}
animate();

// Ciclo de dia e noite com transição suave usando GSAP
const skyColor = { r: 135, g: 206, b: 235 }; // RGB do azul claro (sky blue)
let isDay = true;

function updateSkyAndLight() {
    const targetColor = isDay ? { r: 13, g: 27, b: 42 } : { r: 135, g: 206, b: 235 }; // noite / dia

    // Transição suave do céu e da neblina
    gsap.to(skyColor, {
        ...targetColor,
        duration: 3,
        onUpdate: () => {
            const newColor = new THREE.Color(`rgb(${skyColor.r}, ${skyColor.g}, ${skyColor.b})`);
            scene.background = newColor;
            scene.fog.color = newColor;
        }
    });

    // Transição de intensidade da luz
    gsap.to(light, {
        intensity: isDay ? 0.3 : 1,
        duration: 3
    });

    isDay = !isDay;
    stars.visible = !isDay; // só mostra estrelas à noite
}

// Alternar a cada 8 segundos
setInterval(updateSkyAndLight, 60000);

document.getElementById("doar-btn").addEventListener("click", () => {
    const valor = parseFloat(document.getElementById("doacao").value);
    if (isNaN(valor) || valor < 7) {
        document.getElementById("story").textContent = "Doe pelo menos R$7 para plantar uma árvore.";
        return;
    }

    const arvores = Math.floor(valor / 7);
    const positions = [];

    for (let i = 0; i < arvores; i++) {
        const x = Math.random() * 180 - 90;
        const z = Math.random() * 180 - 90;
        positions.push({ x, z });
    }

    fetch("http://127.0.0.1:8000/api/donations/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ amount: valor, positions: positions })
    })
    .then(res => {
        if (!res.ok) throw new Error("Erro ao registrar doação");
        return res.json();
    })
    .then(data => {
        console.log("Doação registrada:", data);

        // ✅ Após registrar, atualiza floresta com dados do backend
        carregarArvoresDoUsuario();

        document.getElementById("story").textContent =
            `Você plantou ${arvores} árvore(s) virtuais com sua doação de R$${valor.toFixed(2)}.`;

        carregarRanking();
    })
    .catch(err => {
        console.error("Erro ao doar:", err);
        document.getElementById("story").textContent =
            "Erro ao registrar doação. Verifique se você está logado.";
    });
});

function carregarRanking() {
    fetch("http://localhost:8000/api/donors/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}` // se usar token JWT
        }
    })
    .then(res => res.json())
    .then(data => {
        const lista = document.getElementById("ranking-list");
        lista.innerHTML = ""; // limpa os placeholders

        data.slice(0, 5).forEach((d, i) => {
            const li = document.createElement("li");
            li.textContent = `#${i + 1} ${d.first_name} ${d.last_name} - R$ ${parseFloat(d.total_donated).toFixed(2)}`;
            lista.appendChild(li);
        });
    })
    .catch(err => console.error("Erro ao carregar ranking:", err));
}

function carregarArvoresDoUsuario() {
    fetch("http://127.0.0.1:8000/api/my-trees/", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(res => res.json())
    .then(data => {
        // 🔄 Remove árvores anteriores da cena
        arvoreList.forEach(({ trunk, foliage }) => {
            scene.remove(trunk);
            scene.remove(foliage);
        });
        arvoreList.length = 0;

        // 🔁 Reconstrói com base nas posições do backend
        const positions = data.positions || [];
        positions.forEach(pos => createTree(pos.x, pos.z));
    })
    .catch(err => console.error("Erro ao carregar árvores do usuário:", err));
}

window.addEventListener("load", () => {
    carregarRanking();
    carregarArvoresDoUsuario(); // 🌱 novo carregamento por usuário
});

window.addEventListener("load", carregarRanking);
