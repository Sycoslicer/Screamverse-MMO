export const TILE_SIZE = 64;
const TILESET_SRC = './tilesets/tileset.png';
const TILE_COLUMNS = 24;

let tilesetImage = null;

export async function loadTileset() {
    tilesetImage = new Image();
    tilesetImage.src = TILESET_SRC;
    await tilesetImage.decode();
    return tilesetImage;
}

export function getTileImage(index) {
    const canvas = document.createElement('canvas');
    canvas.width = TILE_SIZE;
    canvas.height = TILE_SIZE;
    const ctx = canvas.getContext('2d');

    const sx = (index % TILE_COLUMNS) * TILE_SIZE;
    const sy = Math.floor(index / TILE_COLUMNS) * TILE_SIZE;
    ctx.drawImage(tilesetImage, sx, sy, TILE_SIZE, TILE_SIZE, 0, 0, TILE_SIZE, TILE_SIZE);
    return canvas;
}
