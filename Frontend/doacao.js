
const container = document.getElementById("forest-3d");
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();
scene.background = new THREE.Color(0x87ceeb); // céu azul claro (inicial)
scene.fog = new THREE.Fog(0x87ceeb, 30, 150); // neblina a partir de 30 até sumir em 150

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
setInterval(updateSkyAndLight, 5000);

document.getElementById("doar-btn").addEventListener("click", () => {
    const valor = parseFloat(document.getElementById("doacao").value);
    if (isNaN(valor) || valor < 7) {
        document.getElementById("story").textContent = "Doe pelo menos R$7 para plantar uma árvore.";
        return;
    }

    let arvores = Math.floor(valor / 7);
    for (let i = 0; i < arvores; i++) {
        const x = Math.random() * 180 - 90;
        const z = Math.random() * 180 - 90;
        createTree(x, z);
    }

    document.getElementById("story").textContent = `Você plantou ${arvores} árvore(s) virtuais com sua doação de R$${valor.toFixed(2)}.`;
});
