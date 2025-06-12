import { loadImage, getTilesetList } from './utils.js';

export class TilePicker {
    constructor(onTileSelect) {
        this.onTileSelect = onTileSelect;
        this.tiles = [];
        this.selectedTile = null;
        this.loadTilesets();
    }

    async loadTilesets() {
        const tilesetList = await getTilesetList();
        for (let name of tilesetList) {
            await this.loadTileset(`./tilesets/${name}`);
        }
        this.render();
    }

    async loadTileset(src) {
        const img = await loadImage(src);
        const tileSize = 32;
        const tilesPerRow = Math.floor(img.width / tileSize);
        const tilesPerCol = Math.floor(img.height / tileSize);

        for (let y = 0; y < tilesPerCol; y++) {
            for (let x = 0; x < tilesPerRow; x++) {
                this.tiles.push({
                    image: img,
                    x: x * tileSize,
                    y: y * tileSize
                });
            }
        }
    }

    render() {
        const picker = document.getElementById("tilePicker");
        picker.innerHTML = '';

        for (let i = 0; i < this.tiles.length; i++) {
            const tile = this.tiles[i];
            const canvas = document.createElement("canvas");
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(tile.image, tile.x, tile.y, 32, 32, 0, 0, 32, 32);
            canvas.classList.add("tile-button");

            canvas.addEventListener("click", () => {
                this.selectedTile = tile;
                this.onTileSelect(tile);
            });

            picker.appendChild(canvas);
        }
    }
}
