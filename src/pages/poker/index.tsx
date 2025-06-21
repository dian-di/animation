// Poker.tsx
import { useEffect, useRef, useState } from 'react'
import CardWheel from './card-wheel'
import PokerImg from './poker.jpeg'
import { generateRandomPositions, randomCard } from './util'

// 定义扑克牌组件的状态
type PokerStatus = 'idle' | 'drawingEarly' | 'shuffling' | 'shufflingStopped'

const totalCards = 78 // 总卡牌数量
const centerX = 200 // 动画中心点 X 坐标
const centerY = 200 // 动画中心点 Y 坐标

const Poker = () => {
  // 组件的核心状态机
  const [status, setStatus] = useState<PokerStatus>('idle')
  // 存储每张卡牌的位置信息
  const [positions, setPositions] = useState(generateRandomPositions(totalCards))
  // 存储卡牌数据
  const [cards, setCards] = useState(Array.from({ length: totalCards }, (_, i) => ({ id: i + 1 })))
  // 用于存储洗牌动画的 interval ID
  const shuffleIntervalRef = useRef<number | null>(null)

  // 洗牌函数，随机化卡牌位置和顺序
  const shuffleCards = () => {
    setPositions(generateRandomPositions(totalCards))
    setCards((prev) => randomCard(prev))
  }

  // Effect hook，用于在 'shuffling' 状态时启动和停止洗牌动画
  useEffect(() => {
    if (status === 'shuffling') {
      shuffleIntervalRef.current = window.setInterval(shuffleCards, 1000)
    }
    // 清理函数，在组件卸载或 status 变化时清除 interval
    return () => {
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current)
        shuffleIntervalRef.current = null
      }
    }
  }, [status])

  // 根据组件状态和卡牌索引计算并返回卡牌的样式
  const getCardStyle = (index: number) => {
    const offset = Math.min(index, 20)
    // 在 'drawingEarly' 和 'shuffling' 状态下，卡牌散开
    if (status === 'drawingEarly' || status === 'shuffling') {
      const { x, y, rotation } = positions[index]
      return {
        top: `${centerY + y}px`,
        left: `${centerX + x}px`,
        transform: `rotate(${rotation}deg)`,
        zIndex: index,
      }
    }
    // 在 'idle' 状态下，卡牌堆叠
    return {
      top: `${centerY - offset * 3.2}px`,
      left: `${centerX}px`,
      transform: 'rotate(0deg)',
      zIndex: index,
    }
  }

  // 根据当前状态返回对应的操作按钮
  const getCurButton = () => {
    const commonClass = 'cursor-pointer rounded px-4 py-2 font-semibold text-black'
    switch (status) {
      case 'idle':
        return (
          <div
            onClick={() => {
              shuffleCards()
              setStatus('drawingEarly')
            }}
            className={`bg-white hover:bg-gray-200 ${commonClass}`}
          >
            提前抽牌
          </div>
        )
      case 'drawingEarly':
        return (
          <div onClick={() => setStatus('shuffling')}  className={`bg-yellow-400 hover:bg-yellow-300 ${commonClass}`}>
            开始洗牌
          </div>
        )
      case 'shuffling':
        return (
          <div onClick={() => setStatus('shufflingStopped')}  className={`bg-red-400 hover:bg-red-300 ${commonClass}`}>
            停止洗牌
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div>
      {/* 当洗牌停止时，显示卡牌轮盘 */}
      {status === 'shufflingStopped' ? (
        <CardWheel cards={cards} />
      ) : (
        // 否则，显示卡牌动画
        <div className='flex min-h-screen flex-col items-center justify-center bg-green-700'>
          <div className='mb-4 space-x-4'>{getCurButton()}</div>
          <div className='relative h-[400px] w-[400px]'>
            {cards.map((_, index) => (
              <div
                key={index}
                className='absolute h-36 w-20 rounded border border-black bg-white p-1 transition-all duration-500'
                style={{
                  ...getCardStyle(index),
                  transformOrigin: 'center center',
                  marginLeft: '-40px',
                  marginTop: '-72px',
                  backgroundImage: `url(${PokerImg})`,
                  backgroundSize: 'cover',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Poker
