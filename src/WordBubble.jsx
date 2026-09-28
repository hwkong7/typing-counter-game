// 자체 상태가 없는 순수 표시 컴포넌트. 위치/텍스트/일치 여부를 모두 props로 받습니다.
function WordBubble({ word, matchedLength }) {
  const matched = word.text.slice(0, matchedLength)
  const rest = word.text.slice(matchedLength)

  return (
    <div
      className="word-bubble"
      style={{ left: `${word.x}%`, top: `${word.y}%` }}
    >
      <span className="matched">{matched}</span>
      <span className="rest">{rest}</span>
      <span className="bubble-tail" />
    </div>
  )
}

export default WordBubble
