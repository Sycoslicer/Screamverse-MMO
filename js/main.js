import { createEmptyMap, TILE_SIZE, MAP_WIDTH, MAP_HEIGHT, TILE_SHEET_WIDTH } from './utils.js';
import { isoToScreen, screenToIso } from './isometric.js';
import { loadTileSheet, getTileImage, selectedTile } from './tilePicker.js';
import { saveMap, loadMap, exportMap, importMap } from './saveLoad.js';

let mapData = loadMap();
const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");
let currentLayer = "ground";
let currentTool = "paint";
let tileImage = null;

// Camera State
let cameraX = 0;
let cameraY = 0;
let zoom = 1.0;
let isDragging = false;
let dragStart = { x: 0, y: 0 };

// Selection state
let selectionStart = null;
let selectionEnd = null;

loadTileSheet(img => {
  tileImage = img;
  render();
});

document.getElementById("toolSelector").addEventListener("change", e => {
  currentTool = e.target.value;
});
document.getElementById("layerSelector").addEventListener("change", e => {
  currentLayer = e.target.value;
});
document.getElementById("newMapButton").addEventListener("click", () => {
  if (confirm("Start a new blank map? This will erase current data.")) {
    mapData = createEmptyMap();
    render();
  }
});
document.getElementById("saveButton").addEventListener("click", () => {
  exportMap(mapData);
  alert("Map successfully exported!");
});
document.getElementById("loadButton").addEventListener("click", () => {
  importMap(data => {
    mapData = data;
    render();
    alert("Map successfully loaded!");
  });
});

canvas.addEventListener("mousedown", e => {
  if (e.button === 0 && e.shiftKey) {
    const pos = getWorldMousePos(e);
    selectionStart = pos;
    selectionEnd = pos;
  } else if (e.button === 0) {
    isDragging = true;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
  }
});

canvas.addEventListener("mousemove", e => {
  if (isDragging) {
    cameraX += (e.clientX - dragStart.x) / zoom;
    cameraY += (e.clientY - dragStart.y) / zoom;
    dragStart.x = e.clientX;
    dragStart.y = e.clientY;
    render();
  }

  if (selectionStart) {
    selectionEnd = getWorldMousePos(e);
    render();
  }
});

canvas.addEventListener("mouseup", e => {
  if (isDragging) {
    isDragging = false;
  }

  if (selectionStart && selectionEnd) {
    applySelection(selectionStart, selectionEnd);
    selectionStart = null;
    selectionEnd = null;
    render();
  }
});

canvas.addEventListener("wheel", e => {
  const zoomFactor = 0.1;
  const previousZoom = zoom;
  if (e.deltaY < 0) {
    zoom += zoomFactor;
  } else {
    zoom -= zoomFactor;
  }
  zoom = Math.max(0.2, Math.min(3.0, zoom));

  const mouseX = e.clientX - canvas.offsetLeft;
  const mouseY = e.clientY - canvas.offsetTop;
  cameraX -= (mouseX / previousZoom - mouseX / zoom);
  cameraY -= (mouseY / previousZoom - mouseY / zoom);

  render();
});

canvas.addEventListener("click", e => {
  if (currentTool !== "paint" && currentTool !== "erase") return;
  const isoPos = screenToIsoWorld(e.clientX, e.clientY);
  if (isoPos.x >= 0 && isoPos.x < MAP_WIDTH && isoPos.y >= 0 && isoPos.y < MAP_HEIGHT) {
    if (currentTool === "paint") {
      mapData[currentLayer][isoPos.y][isoPos.x] = selectedTile;
    } else if (currentTool === "erase") {
      mapData[currentLayer][isoPos.y][isoPos.x] = null;
    }
    render();
  }
});

function applySelection(start, end) {
  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  const minY = Math.min(start.y, end.y);
  const maxY = Math.max(start.y, end.y);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (currentTool === "paint") {
        mapData[currentLayer][y][x] = selectedTile;
      } else if (currentTool === "erase") {
        mapData[currentLayer][y][x] = null;
      }
    }
  }
}

function getWorldMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX - rect.left - canvas.width / 2) / zoom - cameraX;
  const my = (e.clientY - rect.top - canvas.height / 4) / zoom - cameraY;
  const iso = screenToIso(mx, my);
  return {
    x: Math.max(0, Math.min(MAP_WIDTH - 1, iso.x)),
    y: Math.max(0, Math.min(MAP_HEIGHT - 1, iso.y))
  };
}

function screenToIsoWorld(screenX, screenY) {
  const rect = canvas.getBoundingClientRect();
  const worldX = (screenX - rect.left - canvas.width / 2) / zoom - cameraX;
  const worldY = (screenY - rect.top - canvas.height / 4) / zoom - cameraY;
  return screenToIso(worldX, worldY);
}

function render() {
  ctx.setTransform(zoom, 0, 0, zoom, canvas.width / 2 + cameraX * zoom, canvas.height / 4 + cameraY * zoom);
  ctx.clearRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2);
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const pos = isoToScreen(x, y);
      for (let layer of ["ground", "objects", "collision", "events"]) {
        const tile = mapData[layer][y][x];
        if (tile !== null && tileImage) {
          const sx = (tile % TILE_SHEET_WIDTH) * TILE_SIZE;
          const sy = Math.floor(tile / TILE_SHEET_WIDTH) * TILE_SIZE;
          ctx.drawImage(tileImage, sx, sy, TILE_SIZE, TILE_SIZE, pos.x - 32, pos.y, 64, 64);
        }
      }
      drawGridCell(pos.x, pos.y);
    }
  }

  // Draw selection box
  if (selectionStart && selectionEnd) {
    ctx.strokeStyle = 'rgba(255,255,0,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const sPos = isoToScreen(selectionStart.x, selectionStart.y);
    const ePos = isoToScreen(selectionEnd.x, selectionEnd.y);
    ctx.rect(
      Math.min(sPos.x, ePos.x) - 32,
      Math.min(sPos.y, ePos.y),
      Math.abs(sPos.x - ePos.x),
      Math.abs(sPos.y - ePos.y)
    );
    ctx.stroke();
  }
}

function drawGridCell(screenX, screenY) {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.moveTo(screenX, screenY + TILE_SIZE / 4);
  ctx.lineTo(screenX + TILE_SIZE / 2, screenY);
  ctx.lineTo(screenX + TILE_SIZE, screenY + TILE_SIZE / 4);
  ctx.lineTo(screenX + TILE_SIZE / 2, screenY + TILE_SIZE / 2);
  ctx.closePath();
  ctx.stroke();
}
