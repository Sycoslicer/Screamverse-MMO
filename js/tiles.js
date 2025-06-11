export let tileImages = {};
export const TILE_SIZE = 32;

export function loadTiles(tileNames, onComplete) {
  let loaded = 0;

  tileNames.forEach(name => {
    const img = new Image();
    img.src = `img/tiles/${name}.png`;
    img.onload = () => {
      loaded++;
      if (loaded === tileNames.length) onComplete();
    };
    tileImages[name] = img;
  });
}
