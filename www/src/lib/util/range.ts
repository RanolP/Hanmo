export function range(max: number) {
  return Array.from({ length: max }).map((_, i) => i);
}
