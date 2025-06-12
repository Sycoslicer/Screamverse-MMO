import { TILE_SIZE, getTileSource } from './utils.js';
import { drawTilePicker, loadTileset, getTilesetImage } from './tilePicker.js';
import { saveMap, loadMapFromFile } from './saveLoad.js';
import { loadTilesetList } from './tilesetLoader.js';

const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const tilePickerDiv = document.getElementById('tilePicker');
const tilesetSelector = document.getElementById('tilesetSelector');

let mapWidth = 100, mapHeight = 100;
let currentLayer = 'ground';
let currentTool = 'paint';
let selectedTile = 0;

let cameraX = 0, cameraY = 0, scale = 1;

let map = {
    ground: Array(mapHeight).fill().map(() => Array(mapWidth).fill(0)),
    objects: Array(mapHeight).fill().map(() => Array(mapWidth).fill(0)),
    collision: Array(mapHeight).fill().map(() => Array(mapWidth).fill(0)),
    events: Array(mapHeight).fill().map(() => Array(mapWidth).fill(0))
};

// Load tilesets into dropdown
async function populateTilesetSelector() {
    const tilesets = await loadTilesetList();
    tilesets.forEach(path => {
        const option = document.createElement('option');
        option.value = path;
        option.textContent = path.split('/').pop();
        tilesetSelector.appendChild(option);
    });

    tilesetSelector.addEventListener('change', () => {
        loadTileset(tilesetSelector.value, () => {
            drawTilePicker(tilePickerDiv);
            redraw();
        });
    });

    loadTileset(tilesets[0], () => {
        drawTilePicker(tilePickerDiv);
        redraw();
    });
}

populateTilesetSelector();

// Handle tile picker clicks
tilePickerDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('tile-button')) {
        selectedTile = parseInt(e.target.dataset.tile);
    }
});

// Handle tool + layer switching
document.getElementById('toolSelector').addEventListener('change', e => currentTool = e.target.value);
document.getElementById('layerSelector').addEventListener('change', e => currentLayer = e.target.value);

// Save/load buttons
document.getElementById('saveButton').addEventListener('click', () => saveMap(map));
document.getElementById('loadButton').addEventListener('click', () => document.getElementById('fileLoader').click());
document.getElementById('fileLoader').addEventListener('change', e => loadMapFromFile(e, map, redraw));

// Tile placement logic
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / scale + cameraX;
    const mouseY = (e.clientY - rect.top) / scale + cameraY;
    const tileX = Math.floor(mouseX / TILE_SIZE);
    const tileY = Math.floor(mouseY / TILE_SIZE);

    if (tileX >= 0 && tileX < mapWidth && tileY >= 0 && tileY < mapHeight) {
        if (currentTool === 'paint') {
            map[currentLayer][tileY][tileX] = selectedTile;
        } else if (currentTool === 'erase') {
            map[currentLayer][tileY][tileX] = 0;
        }
        redraw();
    }
});

// Panning
let isPanning = false;
let panStart = { x: 0, y: 0 };
canvas.addEventListener('mousedown', (e) => {
    if (e.button === 1) { 
        isPanning = true;
        panStart.x = e.clientX;
        panStart.y = e.clientY;
    }
});
canvas.addEventListener('mousemove', (e) => {
    if (isPanning) {
        cameraX -= (e.clientX - panStart.x) / scale;
        cameraY -= (e.clientY - panStart.y) / scale;
        panStart.x = e.clientX;
        panStart.y = e.clientY;
        redraw();
    }
});
canvas.addEventListener('mouseup', () => isPanning = false);
canvas.addEventListener('mouseleave', () => isPanning = false);

// Zooming
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const mouseX = e.offsetX / scale + cameraX;
    const mouseY = e.offsetY / scale + cameraY;

    if (e.deltaY < 0) scale *= 1 + zoomIntensity;
    else scale *= 1 - zoomIntensity;

    cameraX = mouseX - e.offsetX / scale;
    cameraY = mouseY - e.offsetY / scale;
    redraw();
});

// Drawing
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const tilesetImage = getTilesetImage();

    for (let layer of ['ground', 'objects', 'collision', 'events']) {
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                const tile = map[layer][y][x];
                if (tile > 0) {
                    const src = getTileSource(tile);
                    ctx.drawImage(
                        tilesetImage,
                        src.sx, src.sy, TILE_SIZE, TILE_SIZE,
                        (x * TILE_SIZE - cameraX) * scale,
                        (y * TILE_SIZE - cameraY) * scale,
                        TILE_SIZE * scale, TILE_SIZE * scale
                    );
                }
            }
        }
    }

    // Draw grid
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    for (let x = 0; x <= mapWidth; x++) {
        ctx.beginPath();
        ctx.moveTo((x * TILE_SIZE - cameraX) * scale, 0);
        ctx.lineTo((x * TILE_SIZE - cameraX) * scale, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= mapHeight; y++) {
        ctx.beginPath();
        ctx.moveTo(0, (y * TILE_SIZE - cameraY) * scale);
        ctx.lineTo(canvas.width, (y * TILE_SIZE - cameraY) * scale);
        ctx.stroke();
    }
}
