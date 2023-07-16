export function renderPercent(value, total) {
  return ((100 * value) / total).toFixed(2) + '%';
}
