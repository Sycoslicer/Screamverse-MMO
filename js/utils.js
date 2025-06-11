export function create2DArray(width, height, defaultValue = 0) {
  return Array.from({ length: width }, () => Array(height).fill(defaultValue));
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
