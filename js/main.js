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

let isDragging = false;
let lastMouseX, lastMouseY;

let isSelecting = false;
let selectionStart = null;
let selectionEnd = null;
let selectionData = null;

const selectionBox = document.getElementById('selectionBox');

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

canvas.addEventListener('mousedown', e => {
    if (selectedTool === 'select') {
        isSelecting = true;
        const { mapX, mapY } = getMapCoords(e);
        selectionStart = { x: mapX, y: mapY };
        updateSelectionBox(mapX, mapY, mapX, mapY);
        selectionBox.style.display = 'block';
    } else {
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    }
});

canvas.addEventListener('mousemove', e => {
    if (isDragging) {
        offsetX += (e.clientX - lastMouseX);
        offsetY += (e.clientY - lastMouseY);
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        draw();
    } else if (isSelecting) {
        const { mapX, mapY } = getMapCoords(e);
        selectionEnd = { x: mapX, y: mapY };
        updateSelectionBox(selectionStart.x, selectionStart.y, mapX, mapY);
    }
});

canvas.addEventListener('mouseup', e => {
    if (isSelecting) {
        const { mapX, mapY } = getMapCoords(e);
        selectionEnd = { x: mapX, y: mapY };
        captureSelection();
        selectionBox.style.display = 'none';
        isSelecting = false;
    }
    isDragging = false;
});

function getMapCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - offsetX) / zoom;
    const clickY = (e.clientY - rect.top - offsetY) / zoom;
    const { x, y } = screenToIso(clickX, clickY, TILE_SIZE, TILE_SIZE / 2);
    return { mapX: Math.floor(x), mapY: Math.floor(y) };
}

function updateSelectionBox(x1, y1, x2, y2) {
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const maxX = Math.max(x1, x2);
    const maxY = Math.max(y1, y2);
    const { screenX, screenY } = isoToScreen(minX, minY, TILE_SIZE, TILE_SIZE / 2);
    selectionBox.style.left = `${screenX * zoom + offsetX}px`;
    selectionBox.style.top = `${screenY * zoom + offsetY}px`;
    selectionBox.style.width = `${((maxX - minX + 1) * TILE_SIZE / 2) * zoom}px`;
    selectionBox.style.height = `${((maxY - minY + 1) * TILE_SIZE / 2) * zoom}px`;
}

function captureSelection() {
    if (!selectionStart || !selectionEnd) return;
    const minX = Math.min(selectionStart.x, selectionEnd.x);
    const minY = Math.min(selectionStart.y, selectionEnd.y);
    const maxX = Math.max(selectionStart.x, selectionEnd.x);
    const maxY = Math.max(selectionStart.y, selectionEnd.y);
    selectionData = {};

    ['ground', 'objects'].forEach(layer => {
        selectionData[layer] = [];
        for (let y = minY; y <= maxY; y++) {
            const row = [];
            for (let x = minX; x <= maxX; x++) {
                row.push(map[layer]?.[y]?.[x] || 0);
            }
            selectionData[layer].push(row);
        }
    });

    console.log('Selection Captured:', selectionData);
}

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

canvas.addEventListener('click', e => {
    if (selectedTool === 'paint' || selectedTool === 'erase') {
        const { mapX, mapY } = getMapCoords(e);
        if (mapX >= 0 && mapY >= 0 && mapX < mapWidth && mapY < mapHeight) {
            if (selectedTool === 'paint') {
                map[currentLayer][mapY][mapX] = currentTile;
            } else if (selectedTool === 'erase') {
                map[currentLayer][mapY][mapX] = 0;
            }
            draw();
        }
    }
});

canvas.addEventListener('wheel', e => {
    e.preventDefault();
    zoom = clamp(zoom + (e.deltaY > 0 ? -0.1 : 0.1), 0.3, 3);
    draw();
});

init();
