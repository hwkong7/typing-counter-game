// 정답을 맞췄을 때 나타나는 "뿅뿅" 이펙트. 테마에 맞는 아이콘(구름/별/물고기 등)을
// 그대로 props로 받아 보여주기만 하는 프레젠테이션 컴포넌트.
function PopEffect({ effect, icon }) {
  return (
    <span
      className="pop-effect"
      style={{ left: `${effect.x}%`, top: `${effect.y}%` }}
    >
      {icon} +1
    </span>
  )
}

export default PopEffect
