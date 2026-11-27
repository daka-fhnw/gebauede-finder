export function unflattenObject(flat) {
  const obj = {};
  for (const [path, value] of Object.entries(flat)) {
    setPath(obj, path, value);
  }
  return obj;
}

function setPath(obj, path, value) {
  const keys = path.split(".");
  let cur = obj;
  keys.slice(0, -1).forEach((k) => {
    if (typeof cur[k] !== "object" || cur[k] === null) cur[k] = {};
    cur = cur[k];
  });
  cur[keys[keys.length - 1]] = value;
}

export function mergeObjectsByFilename(listA, listB) {
  if (listA.length === 0) {
    return listB;
  }
  if (listB.length === 0) {
    return listA;
  }
  const map = new Map();
  for (const item of [...listA, ...listB]) {
    map.set(item.filename, { ...map.get(item.filename), ...item });
  }
  const list = [...map.values()];
  list.sort((a, b) => a.filename.localeCompare(b.filename));
  return list;
}
