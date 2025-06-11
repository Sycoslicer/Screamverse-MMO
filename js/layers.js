export const layers = {
  data: {
    ground: {},
    objects: {},
    collision: {},
    events: {}
  },
  activeLayer: "ground"
};

export function getActiveLayer() {
  return layers.data[layers.activeLayer];
}

export function drawLayers(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawLayer(ctx, layers.data.ground, "#555");
  drawLayer(ctx, layers.data.objects, "#0f0");
  drawLayer(ctx, layers.data.collision, "#f00");
  drawLayer(ctx, layers.data.events, "#ff0");
  drawGrid(ctx);
}

function drawLayer(ctx, layer, color) {
  ctx.fillStyle = color;
  for (const key in layer) {
    const [x, y] = key.split(",").map(Number);
    ctx.fillRect(x * 32, y * 32, 32, 32);
  }
}

function drawGrid(ctx) {
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;

  for (let x = 0; x < ctx.canvas.width; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ctx.canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y < ctx.canvas.height; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(ctx.canvas.width, y);
    ctx.stroke();
  }
}

export function loadFromJSON(json) {
  layers.data = json;
}

export function saveToFile() {
  return JSON.stringify(layers.data);
}

export function saveToLocal() {
  localStorage.setItem("cipherborneMap", JSON.stringify(layers.data));
}

export function loadFromLocal() {
  const data = localStorage.getItem("cipherborneMap");
  if (data) layers.data = JSON.parse(data);
}
