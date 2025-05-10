// Configuração do canvas principal
const forestCanvas = document.getElementById('forest-canvas');
const forestCtx = forestCanvas.getContext('2d');
forestCanvas.width = window.innerWidth * 0.85;
forestCanvas.height = 400;

const miniMapCanvas = document.getElementById('mini-map');
const miniMapCtx = miniMapCanvas.getContext('2d');
miniMapCanvas.width = 150;
miniMapCanvas.height = 100;

// Estado do ecossistema
const ecosystem = {
    layers: { surface: [], underground: [], sky: [] },
    stars: [],
    totalElements: 0,
    weather: 'sunny',
    zoom: 1,
    panX: 0,
    resources: { wood: 0, water: 0, stellarEnergy: 0 },
    timeOfDay: 'day',
    time: 0
};

// Elementos ecológicos por bioma
const biomeElements = {
    tropical: {
        tree: {
            cost: 7,
            layer: 'surface',
            draw: (x, y, size, mature) => {
                forestCtx.fillStyle = '#8b4513';
                forestCtx.fillRect(x - 5, y - 20 - size, 10, 20 + size);
                forestCtx.fillStyle = mature ? '#ff6347' : '#28a745';
                forestCtx.beginPath();
                forestCtx.moveTo(x - 15 - size, y - 20 - size);
                forestCtx.lineTo(x + 15 + size, y - 20 - size);
                forestCtx.lineTo(x, y - 40 - size * 2);
                forestCtx.fill();
            },
            size: 10,
            maturityTime: 60
        },
        river: { cost: 50, layer: 'surface', draw: (x, y) => { forestCtx.fillStyle = '#1e90ff'; forestCtx.fillRect(x, y - 10, 50, 10); }, size: 0 },
        parrot: { cost: 20, layer: 'surface', draw: (x, y) => { forestCtx.fillStyle = '#ff4500'; forestCtx.fillRect(x, y - 5, 10, 5); }, size: 0 },
        root: { cost: 0, layer: 'underground', draw: (x, y) => { forestCtx.fillStyle = '#8b4513'; forestCtx.fillRect(x - 2, y, 4, 20); }, size: 0 }
    },
    temperate: {
        tree: {
            cost: 7,
            layer: 'surface',
            draw: (x, y, size, mature) => {
                forestCtx.fillStyle = '#654321';
                forestCtx.fillRect(x - 5, y - 20 - size, 10, 20 + size);
                forestCtx.fillStyle = mature ? '#ffd700' : '#228b22';
                forestCtx.beginPath();
                forestCtx.moveTo(x - 20 - size, y - 20 - size);
                forestCtx.lineTo(x + 20 + size, y - 20 - size);
                forestCtx.lineTo(x, y - 50 - size * 2);
                forestCtx.fill();
            },
            size: 10,
            maturityTime: 60
        },
        lake: { cost: 50, layer: 'surface', draw: (x, y) => { forestCtx.fillStyle = '#4682b4'; forestCtx.beginPath(); forestCtx.arc(x, y - 10, 20, 0, Math.PI * 2); forestCtx.fill(); }, size: 0 },
        deer: { cost: 20, layer: 'surface', draw: (x, y) => { forestCtx.fillStyle = '#8b4513'; forestCtx.fillRect(x, y - 5, 15, 5); }, size: 0 },
        root: { cost: 0, layer: 'underground', draw: (x, y) => { forestCtx.fillStyle = '#654321'; forestCtx.fillRect(x - 2, y, 4, 20); }, size: 0 }
    }
};

/**
 * Renderiza o ecossistema no canvas
 */
function renderEcosystem() {
    forestCtx.clearRect(0, 0, forestCanvas.width, forestCanvas.height);
    const biome = document.getElementById('biome').value;
    const layer = document.getElementById('layer').value;

    forestCtx.fillStyle = layer === 'underground' ? '#4a2c0f' : (biome === 'tropical' ? '#9acd32' : '#deb887');
    forestCtx.fillRect(0, forestCanvas.height - (layer === 'sky' ? 150 : 50), forestCanvas.width, layer === 'sky' ? 150 : 50);

    forestCtx.save();
    forestCtx.translate(ecosystem.panX, 0);
    forestCtx.scale(ecosystem.zoom, ecosystem.zoom);

    ecosystem.layers[layer].sort((a, b) => a.y - b.y).forEach(el => el.draw(el.x, el.y, el.size, el.mature));
    if (layer === 'sky') renderSky();
    document.getElementById('weather-overlay').className = `${ecosystem.weather} ${ecosystem.timeOfDay}`;
    forestCtx.restore();

    renderMiniMap();
}

/**
 * Renderiza o céu e as estrelas
 */
function renderSky() {
    const sky = document.getElementById('sky-canvas');
    sky.style.background = ecosystem.timeOfDay === 'day' ? 'linear-gradient(#87ceeb, #4682b4)' : 'linear-gradient(#191970, #000080)';
    ecosystem.stars.forEach(star => {
        forestCtx.fillStyle = 'white';
        forestCtx.beginPath();
        forestCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        forestCtx.fill();
    });
}

/**
 * Renderiza o minimapa
 */
function renderMiniMap() {
    miniMapCtx.clearRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
    miniMapCtx.fillStyle = '#333';
    miniMapCtx.fillRect(0, 0, miniMapCanvas.width, miniMapCanvas.height);
    Object.values(ecosystem.layers).flat().forEach(el => {
        miniMapCtx.fillStyle = el === biomeElements[document.getElementById('biome').value].tree ? '#28a745' : '#fff';
        miniMapCtx.fillRect(el.x / (forestCanvas.width / miniMapCanvas.width), el.y / (forestCanvas.height / miniMapCanvas.height), 2, 2);
    });
}

/**
 * Gera narrativa sobre a preservação
 */
function generateNarrative(treeCount, donationAmount) {
    return `Lyra: "Sua doação de R$${donationAmount.toFixed(2)} plantou ${treeCount} árvores reais e virtuais!"`;
}

/**
 * Processa a doação para preservação ambiental
 */
function processDonation() {
    const donation = parseFloat(document.getElementById('doacao').value);
    if (isNaN(donation) || donation < 7) {
        document.getElementById('story').textContent = "Lyra: 'Doe pelo menos R$7 para apoiar a preservação ambiental!'";
        return;
    }

    const biome = document.getElementById('biome').value;
    let remaining = donation;

    while (remaining >= 7) {
        if (remaining >= biomeElements[biome].river.cost && Math.random() > 0.7) {
            ecosystem.layers.surface.push({ ...biomeElements[biome][biome === 'tropical' ? 'river' : 'lake'], x: Math.random() * forestCanvas.width, y: forestCanvas.height - 50, size: 0 });
            remaining -= biomeElements[biome].river.cost;
            ecosystem.totalElements++;
            ecosystem.resources.water += 10;
        } else if (remaining >= biomeElements[biome].parrot.cost && Math.random() > 0.5) {
            ecosystem.layers.surface.push({ ...biomeElements[biome][biome === 'tropical' ? 'parrot' : 'deer'], x: Math.random() * forestCanvas.width, y: forestCanvas.height - 50, size: 0 });
            remaining -= biomeElements[biome].parrot.cost;
            ecosystem.totalElements++;
        } else {
            const x = Math.random() * forestCanvas.width;
            ecosystem.layers.surface.push({ ...biomeElements[biome].tree, x, y: forestCanvas.height - 50, size: 0, mature: false, age: 0 });
            ecosystem.layers.underground.push({ ...biomeElements[biome].root, x, y: forestCanvas.height - 50 });
            remaining -= biomeElements[biome].tree.cost;
            ecosystem.totalElements += 2;
            ecosystem.resources.wood += 5;
        }
        if (Math.random() > 0.8) {
            ecosystem.stars.push({ x: Math.random() * forestCanvas.width, y: Math.random() * 100, size: Math.random() * 3 });
            ecosystem.layers.sky.push({ ...ecosystem.stars[ecosystem.stars.length - 1] });
            ecosystem.resources.stellarEnergy += 5;
        }
    }

    animateGrowth();
    updateStats();
    document.getElementById('story').textContent = generateNarrative(ecosystem.layers.surface.filter(e => e.cost === 7).length, donation);
    document.getElementById('guardian').textContent = `Lyra: "Obrigada! Sua doação está salvando florestas!"`;
    document.getElementById('resources').textContent = `Madeira: ${ecosystem.resources.wood} | Água: ${ecosystem.resources.water}`;
    document.getElementById('forest-sound').play();
}

/**
 * Anima o crescimento das árvores
 */
function animateGrowth() {
    let frame = 0;
    const interval = setInterval(() => {
        ecosystem.layers.surface.forEach(el => {
            if (el.size < (biomeElements[document.getElementById('biome').value].tree.size || 0)) {
                el.size += 0.5;
            }
            if (el.maturityTime) {
                el.age++;
                if (el.age >= el.maturityTime) el.mature = true;
            }
        });
        renderEcosystem();
        updateStats(); // Atualiza as estatísticas durante a animação
        frame++;
        if (frame > 20) clearInterval(interval);
    }, 50);
}

/**
 * Atualiza estatísticas ambientais
 */
function updateStats() {
    const treeCount = ecosystem.layers.surface.filter(e => e.cost === 7).length;
    document.getElementById('tree-count').textContent = treeCount;
    document.getElementById('co2').textContent = (treeCount * 22).toFixed(1);
    document.getElementById('star-energy').textContent = ecosystem.resources.stellarEnergy;
}

// Eventos do canvas (apenas movimento)
let draggingElement = null;

forestCanvas.addEventListener('mousedown', (e) => {
    const rect = forestCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - ecosystem.panX) / ecosystem.zoom;
    const y = (e.clientY - rect.top) / ecosystem.zoom;
    const layer = document.getElementById('layer').value;

    draggingElement = ecosystem.layers[layer].find(el => Math.hypot(el.x - x, el.y - y) < 20);
});

forestCanvas.addEventListener('mousemove', (e) => {
    if (draggingElement) {
        const rect = forestCanvas.getBoundingClientRect();
        draggingElement.x = Math.max(0, Math.min(forestCanvas.width / ecosystem.zoom, (e.clientX - rect.left - ecosystem.panX) / ecosystem.zoom));
        draggingElement.y = Math.max(0, Math.min(forestCanvas.height / ecosystem.zoom, (e.clientY - rect.top) / ecosystem.zoom));
        renderEcosystem();
    }
});

forestCanvas.addEventListener('mouseup', () => draggingElement = null);

// Eventos dos controles
document.getElementById('doar-btn').addEventListener('click', processDonation);
document.getElementById('zoom-in-btn').addEventListener('click', () => { ecosystem.zoom += 0.2; renderEcosystem(); });
document.getElementById('zoom-out-btn').addEventListener('click', () => { ecosystem.zoom = Math.max(0.5, ecosystem.zoom - 0.2); renderEcosystem(); });
document.getElementById('layer').addEventListener('change', renderEcosystem);
document.getElementById('stats-toggle').addEventListener('click', () => {
    document.getElementById('stats-content').classList.toggle('hidden');
});

/**
 * Atualiza o ciclo ambiental
 */
function updateCycle() {
    ecosystem.time = (ecosystem.time + 1) % 60;
    ecosystem.timeOfDay = ecosystem.time < 30 ? 'day' : 'night';
    if (ecosystem.time === 0 || ecosystem.time === 30) {
        const weathers = ['sunny', 'rainy', 'windy', 'cosmic'];
        ecosystem.weather = weathers[Math.floor(Math.random() * weathers.length)];
        if (ecosystem.weather === 'rainy') {
            ecosystem.layers.surface.forEach(el => { if (el.maturityTime) el.age += 5; });
            document.getElementById('event').textContent = "Evento: Chuva nutre as árvores!";
        } else if (ecosystem.weather === 'windy') {
            ecosystem.layers.surface.forEach(el => { if (!el.maturityTime) el.x += Math.random() * 10 - 5; });
            document.getElementById('event').textContent = "Evento: Vento espalha a vida!";
        } else if (ecosystem.weather === 'cosmic') {
            ecosystem.stars.push({ x: Math.random() * forestCanvas.width, y: Math.random() * 100, size: 5 });
            ecosystem.layers.sky.push({ ...ecosystem.stars[ecosystem.stars.length - 1] });
            ecosystem.resources.stellarEnergy += 10;
            document.getElementById('event').textContent = "Evento: Energias cósmicas revitalizam!";
        } else {
            document.getElementById('event').textContent = "Evento: Sol ilumina a preservação!";
        }
        updateStats(); // Atualiza as estatísticas nos eventos
    }
    renderEcosystem();
}

setInterval(updateCycle, 1000);
renderEcosystem();
updateStats(); // Inicializa as estatísticas

// Confetti effect
const confettiCanvas = document.createElement('canvas');
confettiCanvas.id = 'confetti-canvas';
document.body.appendChild(confettiCanvas);
const confCtx = confettiCanvas.getContext('2d');
function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);
resizeConfetti();
let confettiParticles = [];
function initConfetti() {
    confettiParticles = [];
    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            r: Math.random() * 4 + 2,
            d: Math.random() * 150 + 150,
            color: `hsl(${Math.random() * 360},100%,50%)`,
            tilt: Math.random() * 10 - 10,
            tiltAngleIncremental: Math.random() * 0.07 + .05,
            tiltAngle: 0
        });
    }
}
function drawConfetti() {
    confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach((p, i) => {
        confCtx.beginPath();
        confCtx.lineWidth = p.r;
        confCtx.strokeStyle = p.color;
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r/2) / 2;
        p.x += Math.sin(p.d);
        p.tilt = Math.sin(p.tiltAngle) * 15;
        confCtx.moveTo(p.x + p.tilt + p.r/4, p.y);
        confCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r/4);
        confCtx.stroke();
        if (p.y > confettiCanvas.height) {
            confettiParticles[i].y = -10;
            confettiParticles[i].x = Math.random() * confettiCanvas.width;
        }
    });
    requestAnimationFrame(drawConfetti);
}

// Ranking & Rewards
function updateRanking() {
    const donors = JSON.parse(localStorage.getItem('donors') || '[]');
    donors.sort((a, b) => b.amount - a.amount);
    const tbody = document.querySelector('#ranking-table tbody');
    tbody.innerHTML = '';
    donors.slice(0, 5).forEach((d, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${i+1}</td><td>${d.name}</td><td>${d.amount.toFixed(2)}</td>`;
        tbody.appendChild(tr);
    });
}
function awardBadges(amount) {
    const container = document.getElementById('badge-container');
    container.innerHTML = '';
    if (amount >= 1000) container.innerHTML += '<div class="badge" title="Patron">🏆</div>';
    else if (amount >= 500) container.innerHTML += '<div class="badge" title="Gold">🥇</div>';
    else if (amount >= 100) container.innerHTML += '<div class="badge" title="Silver">🥈</div>';
    else if (amount >= 50) container.innerHTML += '<div class="badge" title="Bronze">🥉</div>';
}

// Integrate into processDonation
const originalProcess = processDonation;
processDonation = function() {
    const name = prompt('Digite seu nome para o ranking:');
    if (!name) return alert('Nome é necessário para o ranking!');
    const donation = parseFloat(document.getElementById('doacao').value);
    originalProcess();
    // Save donor
    const donors = JSON.parse(localStorage.getItem('donors') || '[]');
    donors.push({ name: name.trim(), amount: donation });
    localStorage.setItem('donors', JSON.stringify(donors));
    updateRanking();
    awardBadges(donation);
    // Show confetti
    initConfetti();
    drawConfetti();
};
window.addEventListener('load', () => {
    updateRanking();
});
document.addEventListener("DOMContentLoaded", () => {
    const btnDoar = document.getElementById("doar-btn");
    const modal = document.getElementById("modalDoacao");
    const form = document.getElementById("formDoacao");
    const inputValor = document.getElementById("doacao");
    const story = document.getElementById("story");
  
    btnDoar.addEventListener("click", () => {
      modal.classList.remove("d-none");
    });
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      modal.classList.add("d-none");
  
      const valor = parseFloat(inputValor.value);
      const arvores = Math.floor(valor / 75);
      story.innerHTML = `Lyra: <em>"Sua doação de R$${valor.toFixed(2)} plantou ${arvores} árvores reais e virtuais!"</em>`;
      alert("Pagamento simulado com sucesso!");
    });
  });
  
  function fecharModal() {
    document.getElementById("modalDoacao").classList.add("d-none");
  }
  
