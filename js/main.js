import { drawGrid, screenToGrid } from './utils.js';
import { initTilePicker, selectedTile } from './tilePicker.js';
import { saveMap, loadMap, createNewMap } from './saveLoad.js';
import { isoToScreen, screenToIso, TILE_WIDTH, TILE_HEIGHT } from './isometric.js';

// Global state
let mapWidth = 20;
let mapHeight = 20;
let layers = ['ground', 'objects', 'collision', 'events'];
let mapData = {};
let activeLayer = 'ground';
let tool = 'paint';

// Camera and zoom state
let offsetX = 0;
let offsetY = 0;
let zoom = 1;
let isDragging = false;
let lastMouseX, lastMouseY;

// Initialize empty map
function initEmptyMap() {
  layers.forEach(layer => {
    mapData[layer] = [];
    for (let y = 0; y < mapHeight; y++) {
      mapData[layer][y] = [];
      for (let x = 0; x < mapWidth; x++) {
        mapData[layer][y][x] = -1;
      }
    }
  });
}

// Initialize
createNewMap(mapData, mapWidth, mapHeight);
initTilePicker();
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

// Draw loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(ctx, mapData, mapWidth, mapHeight, offsetX, offsetY, zoom, selectedTile, activeLayer);
  requestAnimationFrame(draw);
}
draw();

// Toolbar Events
document.getElementById('toolSelector').addEventListener('change', (e) => {
  tool = e.target.value;
});

document.getElementById('layerSelector').addEventListener('change', (e) => {
  activeLayer = e.target.value;
});

document.getElementById('saveButton').addEventListener('click', () => {
  saveMap(mapData);
});

document.getElementById('loadButton').addEventListener('click', () => {
  loadMap().then(data => {
    if (data) {
      mapData = data;
    }
  });
});

// Mouse interaction
canvas.addEventListener('mousedown', (e) => {
  if (e.button === 0) {
    handleCanvasClick(e);
  } else if (e.button === 1 || e.button === 2) {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    offsetX += (e.clientX - lastMouseX);
    offsetY += (e.clientY - lastMouseY);
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomAmount = e.deltaY > 0 ? 0.9 : 1.1;
  zoom *= zoomAmount;
  zoom = Math.max(0.2, Math.min(zoom, 5));
});

// Handle painting tiles
function handleCanvasClick(e) {
  const rect = canvas.getBoundingClientRect();
  const screenX = (e.clientX - rect.left - offsetX) / zoom;
  const screenY = (e.clientY - rect.top - offsetY) / zoom;
  const [isoX, isoY] = screenToIso(screenX, screenY);

  if (isoX >= 0 && isoY >= 0 && isoX < mapWidth && isoY < mapHeight) {
    if (tool === 'paint') {
      mapData[activeLayer][isoY][isoX] = selectedTile;
    } else if (tool === 'erase') {
      mapData[activeLayer][isoY][isoX] = -1;
    }
  }
}
