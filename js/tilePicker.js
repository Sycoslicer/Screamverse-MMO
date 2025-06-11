import { TILE_WIDTH, TILE_HEIGHT, TILESET_COLUMNS } from './isometric.js';

export let selectedTile = 0;
export let tilesetImage = new Image();

export function loadTilePicker() {
  const tilePicker = document.getElementById("tilePicker");
  tilePicker.innerHTML = '';

  tilesetImage.src = './tilesets/tileset.png';
  tilesetImage.onload = () => {
    const numTiles = TILESET_COLUMNS * (tilesetImage.height / TILE_HEIGHT);

    for (let i = 0; i < numTiles; i++) {
      const tileDiv = document.createElement("div");
      tileDiv.className = "tile-button";
      tileDiv.style.backgroundImage = `url(./tilesets/tileset.png)`;

      const x = (i % TILESET_COLUMNS) * TILE_WIDTH;
      const y = Math.floor(i / TILESET_COLUMNS) * TILE_HEIGHT;
      tileDiv.style.backgroundPosition = `-${x}px -${y}px`;
      tileDiv.dataset.tileIndex = i;

      tileDiv.addEventListener('click', () => {
        selectedTile = parseInt(tileDiv.dataset.tileIndex);
      });

      tilePicker.appendChild(tileDiv);
    }
  };
}
