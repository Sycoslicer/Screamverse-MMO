export function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

export function getTilesetList() {
    return fetch('./tilesets/tilesets.json')
        .then(response => response.json());
}
