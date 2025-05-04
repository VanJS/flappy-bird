export function generateRandom(min = 0, max = 0) {
  const diff = max - min;
  return Math.random() * diff + min;
}
