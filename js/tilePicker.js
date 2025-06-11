export let selectedTile = 0;
let tileImage;

export function loadTileSheet(callback) {
  tileImage = new Image();
  tileImage.src = './assets/tilesheet.png';  // <-- drop your tilesheet image here!
  tileImage.onload = () => {
    initializeTilePicker();
    callback(tileImage);
  };
}

export function getTileImage() {
  return tileImage;
}

function initializeTilePicker() {
  const tilePicker = document.getElementById("tilePicker");
  tilePicker.innerHTML = "";

  const numTiles = (tileImage.width / 64) * (tileImage.height / 64);
  for (let i = 0; i < numTiles; i++) {
    const btn = document.createElement("canvas");
    btn.width = 32;
    btn.height = 32;
    btn.className = "tile-button";

    const ctx = btn.getContext("2d");
    const sx = (i % (tileImage.width / 64)) * 64;
    const sy = Math.floor(i / (tileImage.width / 64)) * 64;

    ctx.drawImage(tileImage, sx, sy, 64, 64, 0, 0, 32, 32);

    btn.dataset.tileId = i;
    btn.addEventListener("click", () => {
      selectedTile = parseInt(btn.dataset.tileId);
    });
    tilePicker.appendChild(btn);
  }
}
