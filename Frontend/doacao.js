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