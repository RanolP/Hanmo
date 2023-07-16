export function mergeKeys(objs) {
  return new Set([...objs.flatMap((obj) => Object.keys(obj))]);
}
