export let tileSet = new Image();
export const TILE_SIZE = 32;
export let tileCountX = 0;
export let tileCountY = 0;

export function loadTileSet(src, callback) {
  tileSet.onload = () => {
    tileCountX = Math.floor(tileSet.width / TILE_SIZE);
    tileCountY = Math.floor(tileSet.height / TILE_SIZE);
    callback();
  };
  tileSet.src = src;
}
