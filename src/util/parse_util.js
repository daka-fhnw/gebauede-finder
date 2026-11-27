export function parseLineAttributes(text) {
  const result = {};
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*([^:]+?)\s*:\s*(.*?)\s*$/);
    if (match) {
      const [, name, value] = match;
      result[name] = value;
    }
  }
  return result;
}

export function parseCoordinate(text) {
  if (typeof text !== "string") {
    return null;
  }
  const [lat, lng] = text.split(",").map((s) => parseFloat(s.trim()));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }
  return { lat, lng };
}
