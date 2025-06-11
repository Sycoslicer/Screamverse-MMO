export class Tileset {
  constructor(jsonPath) {
    this.jsonPath = jsonPath;
    this.image = new Image();
    this.ready = false;
  }

  async load() {
    const res = await fetch(this.jsonPath);
    const data = await res.json();
    this.tileWidth = data.tileWidth;
    this.tileHeight = data.tileHeight;
    this.tilesPerRow = data.tilesPerRow;
    this.image.src = `tilesets/${data.image}`;

    return new Promise(resolve => {
      this.image.onload = () => {
        this.ready = true;
        resolve();
      };
    });
  }

  drawTile(ctx, tileIndex, x, y) {
    if (!this.ready) return;
    const sx = (tileIndex % this.tilesPerRow) * this.tileWidth;
    const sy = Math.floor(tileIndex / this.tilesPerRow) * this.tileHeight;
    ctx.drawImage(this.image, sx, sy, this.tileWidth, this.tileHeight, x, y, this.tileWidth, this.tileHeight);
  }
}
