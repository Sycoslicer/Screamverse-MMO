import { TILE_SIZE, loadTilesetImage, getTileSource } from './utils.js';

let TILESET_IMAGE = null;
let currentTilesetPath = 'tilesets/tileset.png';
let numTiles = 0;

// Load the selected tileset image
export function loadTileset(path, callback) {
    currentTilesetPath = path;
    const image = new Image();
    image.onload = () => {
        TILESET_IMAGE = image;
        numTiles = Math.floor(image.width / TILE_SIZE);
        callback();
    };
    image.src = path;
}

export function drawTilePicker(container) {
    container.innerHTML = '';
    for (let i = 0; i < numTiles; i++) {
        const button = document.createElement('div');
        button.className = 'tile-button';
        button.dataset.tile = i + 1;
        button.style.backgroundImage = `url(${currentTilesetPath})`;
        button.style.backgroundPosition = `-${i * TILE_SIZE}px 0px`;
        container.appendChild(button);
    }
}

export function getTilesetImage() {
    return TILESET_IMAGE;
}

export function getNumTiles() {
    return numTiles;
}
