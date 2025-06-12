// camera.js

export class Camera {
  constructor() {
    this.offsetX = 0;
    this.offsetY = 0;
    this.zoom = 1;
    this.minZoom = 0.5;
    this.maxZoom = 4;
  }

  pan(dx, dy) {
    this.offsetX += dx / this.zoom;
    this.offsetY += dy / this.zoom;
  }

  applyZoom(delta, centerX, centerY, canvas) {
    const newZoom = this.zoom + delta;
    if (newZoom < this.minZoom || newZoom > this.maxZoom) return;

    const rect = canvas.getBoundingClientRect();
    const zoomFactor = newZoom / this.zoom;
    const cx = (centerX - rect.left) / this.zoom - this.offsetX;
    const cy = (centerY - rect.top) / this.zoom - this.offsetY;

    this.offsetX -= cx * (zoomFactor - 1);
    this.offsetY -= cy * (zoomFactor - 1);
    this.zoom = newZoom;
  }
}
