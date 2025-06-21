import { useRef, useState } from 'react';
import PokerImg from './poker.jpeg'

// 定义卡片类型
interface Card {
  id: number;
}

interface CardWheelProps {
  cards: Card[];
}

const CardWheel = ({ cards }: CardWheelProps) => {
  const [scale, setScale] = useState<number>(1);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const initialDistance = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // 处理触摸开始事件
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      initialDistance.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    } else if (e.touches.length === 1) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  // 处理触摸移动事件
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && initialDistance.current) {
      // e.preventDefault();
      const currentDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = scale * (currentDistance / initialDistance.current);
      setScale(Math.min(Math.max(newScale, 0.5), 2));
    } else if (e.touches.length === 1 && touchStartY.current !== null) {
      // e.preventDefault();
      const deltaY = e.touches[0].clientY - touchStartY.current;
      setRotation((prev) => prev + deltaY * 0.6);
      touchStartY.current = e.touches[0].clientY;
    }
  };

  // 处理触摸结束事件
  const handleTouchEnd = () => {
    initialDistance.current = null;
    touchStartY.current = null;
  };

  // 处理鼠标滚轮事件
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    setRotation((prev) => prev + e.deltaY * 0.6);
  };

  // 处理卡片点击
  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
  };

  return (
    <div className='flex h-screen w-screen touch-none flex-col items-center justify-center overflow-hidden bg-gray-100'>
      {/* 卡片轮盘容器 */}
      <div 
        className='fixed left-4/7 flex h-96 w-96 origin-center items-center justify-center transition-transform duration-100 ease-out'
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {cards.map((card, index) => {
          const angle = (index * 360 / cards.length);
          const radius = 200 * scale;
          const x = radius * Math.cos(angle * Math.PI / 180);
          const y = radius * Math.sin(angle * Math.PI / 180);
          
          return (
            <div
              key={card.id}
              className={`absolute flex h-30 w-20 origin-center cursor-pointer items-center justify-center rounded-lg bg-white shadow-md transition-all duration-300 ease-in-out ${selectedCard?.id === card.id ? 'z-10 scale-125 bg-orange-100 shadow-lg' : 'z-1'}`}
              style={{
                transform: `translate(${x}px, ${y}px) rotate(${angle + 90}deg)`,
                backgroundImage: `url(${PokerImg})`,
                backgroundSize: 'cover',
              }}
              onClick={() => handleCardClick(card)}
            >
            </div>
          );
        })}
      </div>
      
      {/* 选中卡片信息 */}
      {selectedCard && (
        <div className='mt-8 max-w-[80%] rounded-lg bg-white p-5 text-center shadow-md'>
          <h3 className='font-medium text-lg'>{selectedCard.id}</h3>
        </div>
      )}
    </div>
  );
};

export default CardWheel;