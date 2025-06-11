import { initTilePicker, getSelectedTile } from './tilePicker.js';
import { initEventEditor } from './eventEditor.js';

const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

export let mapData = {
  width: 32,
  height: 32,
  layers: {
    ground: [],
    objects: [],
    collision: [],
    events: []
  }
};

initTilePicker();
initEventEditor();

for (let layer in mapData.layers) {
  mapData.layers[layer] = new Array(mapData.width * mapData.height).fill(null);
}

document.getElementById("saveButton").addEventListener("click", () => {
  const json = JSON.stringify(mapData);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "map.json";
  a.click();
});

document.getElementById("loadButton").addEventListener("click", () => {
  document.getElementById("fileLoader").click();
});

document.getElementById("fileLoader").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    mapData = JSON.parse(reader.result);
    redraw();
  };
  reader.readAsText(file);
});

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / 32);
  const y = Math.floor((e.clientY - rect.top) / 32);
  const tool = document.getElementById("toolSelector").value;
  const layer = document.getElementById("layerSelector").value;

  if (tool === "paint") {
    mapData.layers[layer][y * mapData.width + x] = getSelectedTile();
  } else if (tool === "erase") {
    mapData.layers[layer][y * mapData.width + x] = null;
  }
  redraw();
});

export function setEventAtTile(x, y, eventObj) {
  mapData.layers.events[y * mapData.width + x] = eventObj;
  redraw();
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTiles();
  drawGrid();
}

function drawTiles() {
  const layers = ["ground", "objects", "collision"];
  layers.forEach(layer => {
    mapData.layers[layer].forEach((tile, i) => {
      if (tile !== null) {
        const x = (i % mapData.width) * 32;
        const y = Math.floor(i / mapData.width) * 32;
        ctx.fillStyle = tile.color;
        ctx.fillRect(x, y, 32, 32);
      }
    });
  });

  mapData.layers.events.forEach((event, i) => {
    if (event) {
      const x = (i % mapData.width) * 32;
      const y = Math.floor(i / mapData.width) * 32;
      ctx.fillStyle = "yellow";
      ctx.fillRect(x + 8, y + 8, 16, 16);
    }
  });
}

function drawGrid() {
  ctx.strokeStyle = "#333";
  for (let x = 0; x < canvas.width; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

redraw();
