// main.js

import { getMousePos, createEmptyGrid, deepCopy } from './utils.js';
import { Clipboard } from './clipboard.js';
import { Camera } from './camera.js';

const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

const mapWidth = 100;
const mapHeight = 100;
const tileSize = 32;

const grid = createEmptyGrid(mapWidth, mapHeight);
const clipboard = new Clipboard();
const undoStack = [];

let currentTool = 'paint';
let selectedTile = 0;

// Selection box logic
let selecting = false;
let selectStart = null;
let selectEnd = null;

// Viewport camera
const camera = new Camera();
let panning = false;
let lastPan = { x: 0, y: 0 };

canvas.addEventListener('mousedown', (e) => {
  if (e.button === 1) { // middle mouse for panning
    panning = true;
    lastPan = { x: e.clientX, y: e.clientY };
    return;
  }

  const pos = getMousePos(canvas, e, camera, tileSize);

  if (currentTool === 'select') {
    selecting = true;
    selectStart = pos;
    selectEnd = pos;
  } else if (currentTool === 'paint') {
    saveState();
    grid[pos.y][pos.x] = selectedTile;
    draw();
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (panning) {
    const dx = e.clientX - lastPan.x;
    const dy = e.clientY - lastPan.y;
    camera.pan(-dx, -dy);
    lastPan = { x: e.clientX, y: e.clientY };
    draw();
  }

  if (selecting) {
    const pos = getMousePos(canvas, e, camera, tileSize);
    selectEnd = pos;
    draw();
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (e.button === 1) {
    panning = false;
    return;
  }
  selecting = false;
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  camera.applyZoom(-e.deltaY * 0.001, e.clientX, e.clientY, canvas);
  draw();
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'c') {
    if (selectStart && selectEnd) {
      const [startX, endX] = [selectStart.x, selectEnd.x].sort((a, b) => a - b);
      const [startY, endY] = [selectStart.y, selectEnd.y].sort((a, b) => a - b);
      clipboard.copy(grid, startX, startY, endX, endY);
    }
  }

  if (e.ctrlKey && e.key === 'v') {
    if (selectStart) {
      saveState();
      clipboard.paste(grid, selectStart.x, selectStart.y);
      draw();
    }
  }

  if (e.ctrlKey && e.key === 'z') {
    undo();
    draw();
  }
});

function saveState() {
  undoStack.push(deepCopy(grid));
}

function undo() {
  if (undoStack.length > 0) {
    const last = undoStack.pop();
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        grid[y][x] = last[y][x];
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(camera.offsetX * camera.zoom, camera.offsetY * camera.zoom);
  ctx.scale(camera.zoom, camera.zoom);

  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      ctx.strokeStyle = "#444";
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);

      if (grid[y][x] >= 0) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(x * tileSize + 8, y * tileSize + 8, 16, 16);
      }
    }
  }

  if (selectStart && selectEnd) {
    const [startX, endX] = [selectStart.x, selectEnd.x].sort((a, b) => a - b);
    const [startY, endY] = [selectStart.y, selectEnd.y].sort((a, b) => a - b);
    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX * tileSize, startY * tileSize, (endX - startX + 1) * tileSize, (endY - startY + 1) * tileSize);
  }

  ctx.restore();
}

draw();
