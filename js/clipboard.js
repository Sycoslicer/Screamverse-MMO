// clipboard.js

import { deepCopy } from './utils.js';

export class Clipboard {
  constructor() {
    this.data = null;
  }

  copy(grid, startX, startY, endX, endY) {
    const width = endX - startX + 1;
    const height = endY - startY + 1;

    const copied = [];
    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        row.push(grid[startY + y][startX + x] ?? -1);
      }
      copied.push(row);
    }
    this.data = copied;
  }

  paste(grid, targetX, targetY) {
    if (!this.data) return;

    for (let y = 0; y < this.data.length; y++) {
      for (let x = 0; x < this.data[0].length; x++) {
        const gridY = targetY + y;
        const gridX = targetX + x;

        if (grid[gridY] && grid[gridY][gridX] !== undefined) {
          grid[gridY][gridX] = this.data[y][x];
        }
      }
    }
  }
}
