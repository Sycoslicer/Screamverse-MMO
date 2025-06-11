export const TILE_SIZE = 64;
export const MAP_WIDTH = 20;
export const MAP_HEIGHT = 20;
export const TILE_SHEET_WIDTH = 8; // Number of columns in your tilesheet image

export function createEmptyMap() {
  return {
    ground: createLayer(),
    objects: createLayer(),
    collision: createLayer(),
    events: createLayer()
  };
}

function createLayer() {
  return Array.from({ length: MAP_HEIGHT }, () => Array(MAP_WIDTH).fill(null));
}
