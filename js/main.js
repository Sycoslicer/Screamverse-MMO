import { isoToScreen, screenToIso, clamp } from './utils.js';
import { loadTileset, getTileImage, TILE_SIZE } from './tileLoader.js';
import { saveMap, loadMap } from './saveLoad.js';

const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

let mapWidth = 50;
let mapHeight = 50;
let map = createEmptyMap(mapWidth, mapHeight);

let currentTile = 0;
let selectedTool = 'paint';
let currentLayer = 'ground';

let offsetX = canvas.width / 2;
let offsetY = 100;
let zoom = 1;

let tilesetImage = null;

async function init() {
    tilesetImage = await loadTileset();
    draw();
}

function createEmptyMap(width, height) {
    let map = {};
    ['ground', 'objects', 'collision', 'events'].forEach(layer => {
        map[layer] = Array.from({ length: height }, () => Array(width).fill(0));
    });
    return map;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            ['ground', 'objects'].forEach(layer => {
                const tileIndex = map[layer][y][x];
                if (tileIndex > 0) {
                    const { screenX, screenY } = isoToScreen(x, y, TILE_SIZE, TILE_SIZE / 2);
                    const drawX = (screenX * zoom) + offsetX;
                    const drawY = (screenY * zoom) + offsetY;
                    ctx.drawImage(getTileImage(tileIndex), drawX, drawY);
                }
            });
        }
    }
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - offsetX) / zoom;
    const clickY = (e.clientY - rect.top - offsetY) / zoom;
    const { x, y } = screenToIso(clickX, clickY, TILE_SIZE, TILE_SIZE / 2);
    const mapX = Math.floor(x);
    const mapY = Math.floor(y);

    if (mapX >= 0 && mapY >= 0 && mapX < mapWidth && mapY < mapHeight) {
        if (selectedTool === 'paint') {
            map[currentLayer][mapY][mapX] = currentTile;
        } else if (selectedTool === 'erase') {
            map[currentLayer][mapY][mapX] = 0;
        }
        draw();
    }
});

// TOOLBARS
document.getElementById('toolSelector').addEventListener('change', e => selectedTool = e.target.value);
document.getElementById('layerSelector').addEventListener('change', e => currentLayer = e.target.value);

document.getElementById('saveButton').addEventListener('click', () => saveMap(map));
document.getElementById('loadButton').addEventListener('click', () => {
    document.getElementById('fileLoader').click();
});
document.getElementById('fileLoader').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        map = await loadMap(file);
        draw();
    }
});

// ZOOM & PAN CONTROL
canvas.addEventListener('wheel', e => {
    e.preventDefault();
    zoom = clamp(zoom + (e.deltaY > 0 ? -0.1 : 0.1), 0.3, 3);
    draw();
});

let isDragging = false;
let lastMouseX, lastMouseY;

canvas.addEventListener('mousedown', e => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

canvas.addEventListener('mouseup', () => isDragging = false);
canvas.addEventListener('mouseleave', () => isDragging = false);

canvas.addEventListener('mousemove', e => {
    if (isDragging) {
        offsetX += (e.clientX - lastMouseX);
        offsetY += (e.clientY - lastMouseY);
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        draw();
    }
});

init();
