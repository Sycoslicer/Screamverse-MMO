// utils.js

export function getMousePos(canvas, evt, camera, tileSize) {
  const rect = canvas.getBoundingClientRect();
  const x = (evt.clientX - rect.left) / camera.zoom - camera.offsetX;
  const y = (evt.clientY - rect.top) / camera.zoom - camera.offsetY;
  return {
    x: Math.floor(x / tileSize),
    y: Math.floor(y / tileSize)
  };
}

export function createEmptyGrid(width, height) {
  const grid = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push(-1);
    }
    grid.push(row);
  }
  return grid;
}

export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
