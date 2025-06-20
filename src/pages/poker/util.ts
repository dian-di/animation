  // 生成每张牌的随机位置和角度
  export  function generateRandomPositions(totalCards: number) {
    return Array.from({ length: totalCards }, () => ({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
      rotation: Math.random() * 60 - 30,
    }))
  }