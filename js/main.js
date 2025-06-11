// Import external modules
import { generateEmptyMap } from './mapManager.js';
import { saveMapToFile, loadMapFromFile } from './saveLoad.js';
import { initializeTilePicker, getSelectedTile } from './tilePicker.js';

// Initialize layers
const layers = ['ground', 'objects', 'collision', 'events'];
let mapData = {};
let mapWidth = 20;
let mapHeight = 20;

// Canvas setup
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

// Camera setup for future pan/zoom
let camera = { x: 0, y: 0, zoom: 1 };

// Toolbar elements
const toolSelector = document.getElementById('toolSelector');
const layerSelector = document.getElementById('layerSelector');
const saveButton = document.getElementById('saveButton');
const loadButton = document.getElementById('loadButton');
const fileLoader = document.getElementById('fileLoader');
const newMapButton = document.getElementById('newMapButton');

// Modal for new map
const newMapDialog = document.getElementById('newMapDialog');
const createMapConfirm = document.getElementById('createMapConfirm');
const createMapCancel = document.getElementById('createMapCancel');

// TILE SIZE (adjust later when tileset loads)
const TILE_SIZE = 32;

// Track mouse position
let mouseX = 0;
let mouseY = 0;

// Initialize the tile picker
initializeTilePicker();

// Create default new map on startup
createNewMap(mapWidth, mapHeight);
renderMap();

// Handle toolbar buttons
saveButton.addEventListener('click', () => {
    saveMapToFile(mapData);
});

loadButton.addEventListener('click', () => {
    fileLoader.click();
});

fileLoader.addEventListener('change', (e) => {
    const file = e.target.files[0];
    loadMapFromFile(file, (loadedData) => {
        mapData = loadedData;
        renderMap();
    });
});

// New map modal logic
newMapButton.addEventListener('click', () => {
    newMapDialog.style.display = 'block';
});

createMapCancel.addEventListener('click', () => {
    newMapDialog.style.display = 'none';
});

createMapConfirm.addEventListener('click', () => {
    const width = parseInt(document.getElementById('mapWidthInput').value);
    const height = parseInt(document.getElementById('mapHeightInput').value);
    createNewMap(width, height);
    newMapDialog.style.display = 'none';
});

// Create new blank map
function createNewMap(width, height) {
    mapWidth = width;
    mapHeight = height;
    mapData = generateEmptyMap(width, height, layers);
    renderMap();
}

// Handle map rendering
function renderMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    for (let layer of layers) {
        for (let y = 0; y < mapHeight; y++) {
            for (let x = 0; x < mapWidth; x++) {
                const tile = mapData[layer][y][x];
                if (tile !== -1) {
                    // Placeholder: draw tiles as colored squares for now
                    ctx.fillStyle = getLayerColor(layer);
                    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        }
    }

    ctx.restore();
}

// Color coding each layer for debugging
function getLayerColor(layer) {
    switch (layer) {
        case 'ground': return '#666';
        case 'objects': return '#0f0';
        case 'collision': return '#f00';
        case 'events': return '#00f';
        default: return '#fff';
    }
}

// Canvas mouse click logic
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left - camera.x) / camera.zoom;
    mouseY = (e.clientY - rect.top - camera.y) / camera.zoom;
    const gridX = Math.floor(mouseX / TILE_SIZE);
    const gridY = Math.floor(mouseY / TILE_SIZE);

    if (gridX >= 0 && gridX < mapWidth && gridY >= 0 && gridY < mapHeight) {
        const currentLayer = layerSelector.value;
        const selectedTile = getSelectedTile();
        const currentTool = toolSelector.value;

        if (currentTool === 'paint') {
            mapData[currentLayer][gridY][gridX] = selectedTile;
        } else if (currentTool === 'erase') {
            mapData[currentLayer][gridY][gridX] = -1;
        }
        renderMap();
    }
});
