import { getActiveLayer } from './layers.js';

export let activeTool = "paint";

export function setActiveTool(tool) {
  activeTool = tool;
}

export const tools = {
  paint: (x, y) => {
    const layer = getActiveLayer();
    layer[`${x},${y}`] = 1;
  },

  erase: (x, y) => {
    const layer = getActiveLayer();
    delete layer[`${x},${y}`];
  },

  select: (x, y) => {
    console.log(`Selected cell ${x},${y}`);
    // Placeholder for future select logic (copy-paste)
  },

  event: (x, y) => {
    const layer = getActiveLayer();
    layer[`${x},${y}`] = { event: "TriggerZone" };
  }
};
