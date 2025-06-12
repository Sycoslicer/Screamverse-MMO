// main.js

import { getMousePos, createEmptyGrid, deepCopy } from './utils.js';
import { Clipboard } from './clipboard.js';

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

canvas.addEventListener('mousedown', (e) => {
  const pos = getMousePos(canvas, e, { zoom: 1, offsetX: 0, offsetY: 0 }, tileSize);

  if (currentTool === 'select') {
    selecting = true;
    selectStart = pos;
    selectEnd = pos;
  } else if (currentTool === 'paint') {
    saveState();
    grid[pos.y][pos.x] = selectedTile;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (selecting) {
    const pos = getMousePos(canvas, e, { zoom: 1, offsetX: 0, offsetY: 0 }, tileSize);
    selectEnd = pos;
    draw();
  }
});

canvas.addEventListener('mouseup', () => {
  selecting = false;
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
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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
}

draw();
