import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigator = useNavigate()
  return (
    <div>
      <Button onClick={() => navigator('/poker')}  className='text-red-500'>
       Poker(塔罗牌、扑克)
      </Button> 
    </div>
  )
}
