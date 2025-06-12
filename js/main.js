import { TilePicker } from './tilePicker.js';

const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

let offsetX = 0;
let offsetY = 0;
let zoom = 1;
let isDragging = false;
let dragStart = {x: 0, y: 0};
let mapData = {};

const gridSize = 32;
const mapWidth = 100;
const mapHeight = 100;

let currentTile = null;

const picker = new TilePicker(tile => {
    currentTile = tile;
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#444';
    for (let x = 0; x < mapWidth; x++) {
        for (let y = 0; y < mapHeight; y++) {
            const screenX = (x * gridSize - offsetX) * zoom;
            const screenY = (y * gridSize - offsetY) * zoom;
            ctx.strokeRect(screenX, screenY, gridSize * zoom, gridSize * zoom);

            const key = `${x},${y}`;
            const tile = mapData[key];
            if (tile) {
                ctx.drawImage(
                    tile.image,
                    tile.x, tile.y, 32, 32,
                    screenX, screenY, 32 * zoom, 32 * zoom
                );
            }
        }
    }
}

canvas.addEventListener("mousedown", e => {
    if (e.button === 0) {
        const x = Math.floor((e.offsetX / zoom + offsetX) / gridSize);
        const y = Math.floor((e.offsetY / zoom + offsetY) / gridSize);
        if (currentTile) {
            mapData[`${x},${y}`] = currentTile;
        }
    } else if (e.button === 1 || e.button === 2) {
        isDragging = true;
        dragStart = {x: e.clientX, y: e.clientY};
    }
});

canvas.addEventListener("mousemove", e => {
    if (isDragging) {
        offsetX -= (e.clientX - dragStart.x) / zoom;
        offsetY -= (e.clientY - dragStart.y) / zoom;
        dragStart = {x: e.clientX, y: e.clientY};
    }
});

canvas.addEventListener("mouseup", () => isDragging = false);
canvas.addEventListener("wheel", e => {
    zoom *= e.deltaY > 0 ? 0.9 : 1.1;
});

function loop() {
    draw();
    requestAnimationFrame(loop);
}
loop();
