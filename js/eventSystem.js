export const events = {};

export function addEvent(x, y, layer, eventData) {
  events[`${x},${y},${layer}`] = eventData;
}

export function getEvent(x, y, layer) {
  return events[`${x},${y},${layer}`];
}

export function clearEvents() {
  for (let key in events) delete events[key];
}
