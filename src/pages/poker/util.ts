// 生成每张牌的随机位置和角度
export function generateRandomPositions(totalCards: number) {
  return Array.from({ length: totalCards }, () => ({
    x: Math.random() * 200 - 100,
    y: Math.random() * 200 - 100,
    rotation: Math.random() * 60 - 30,
  }))
}


export function randomCard<T>(array: T[]): T[] {
  const arr = array.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
