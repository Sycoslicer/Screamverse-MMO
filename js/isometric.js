import { TILE_SIZE } from './utils.js';

export function isoToScreen(x, y) {
  return {
    x: (x - y) * (TILE_SIZE / 2) + 512,
    y: (x + y) * (TILE_SIZE / 4) + 100
  };
}

export function screenToIso(screenX, screenY) {
  screenX -= 512;
  screenY -= 100;
  const x = (screenX / (TILE_SIZE / 2) + screenY / (TILE_SIZE / 4)) / 2;
  const y = (screenY / (TILE_SIZE / 4) - screenX / (TILE_SIZE / 2)) / 2;
  return { x: Math.floor(x), y: Math.floor(y) };
}
