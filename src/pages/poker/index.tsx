import { useEffect, useRef, useState } from 'react'
import PokerImg from './poker.jpeg'
import { generateRandomPositions } from './util'

const Poker = () => {
  const totalCards = 78
  const centerX = 200
  const centerY = 200

  const [isScattered, setIsScattered] = useState(false)
  const [positions, setPositions] = useState(generateRandomPositions(totalCards))
  const [isShuffling, setIsShuffling] = useState(false)

  const shuffleIntervalRef = useRef<number | null>(null)

  const cards = Array.from({ length: totalCards }, (_, i) => i)


  const startShuffling = () => {
    if (shuffleIntervalRef.current) return // 防止重复启动
    shuffleIntervalRef.current = window.setInterval(() => {
      setPositions(generateRandomPositions(totalCards))
    }, 1000) // 每100ms洗一次
    setIsShuffling(true)
  }

  const stopShuffling = () => {
    if (shuffleIntervalRef.current) {
      clearInterval(shuffleIntervalRef.current)
      shuffleIntervalRef.current = null
    }
    setIsShuffling(false)
  }

  const toggleScattered = () => {
    if (!isScattered) {
      setPositions(generateRandomPositions(totalCards))
    }
    setIsScattered(!isScattered)
  }

  useEffect(() => {
    return () => {
      // 清理定时器，防止组件卸载后仍然执行
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current)
      }
    }
  }, [])

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-green-700'>
      <div className='mb-4 space-x-4'>
        <div
          onClick={toggleScattered}
          className='rounded bg-white px-4 py-2 font-semibold text-black hover:bg-gray-200'
        >
          {isScattered ? '重置为整齐' : '点击提前抽牌'}
        </div>
        <div
          onClick={isShuffling ? stopShuffling : startShuffling}
          className={`rounded px-4 py-2 font-semibold ${
            isShuffling ? 'bg-red-500 hover:bg-red-400' : 'bg-yellow-300 hover:bg-yellow-200'
          } text-black`}
        >
          {isShuffling ? '停止洗牌' : '开始洗牌'}
        </div>
      </div>

      <div className='relative h-[400px] w-[400px]'>
        {cards.map((card, index) => {
          const maxVisibleStack = 20
          const offsetIndex = Math.min(index, maxVisibleStack)

          const { x, y, rotation } = positions[index]

          const style = isScattered
            ? {
                top: `${centerY + y}px`,
                left: `${centerX + x}px`,
                transform: `rotate(${rotation}deg)`,
                zIndex: index,
              }
            : {
                top: `${centerY - offsetIndex * 3.2}px`,
                left: `${centerX}px`,
                transform: 'rotate(0deg)',
                zIndex: index,
              }

          return (
            <div
              key={index}
              className='absolute h-36 w-20 overflow-hidden rounded border border-black bg-white p-1 transition-all duration-500'
              style={{
                ...style,
                transformOrigin: 'center center',
                marginLeft: '-40px',
                marginTop: '-72px',
                backgroundImage: `url(${PokerImg})`,
                backgroundSize: 'cover',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default Poker