import { DIFFICULTIES, LIVES_OPTIONS, GOAL_OPTIONS } from './settings'

// 홈 화면의 "게임 설정" 버튼을 눌렀을 때 뜨는 팝업. 선택값과 변경 핸들러를
// props로만 받는 프레젠테이션 컴포넌트라 자체 상태가 없습니다.
function HomeSettingsModal({
  difficultyId,
  onSelectDifficulty,
  startLives,
  onSelectLives,
  goalScore,
  onSelectGoal,
  onClose,
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal settings-popup" onClick={e => e.stopPropagation()}>
        <h2>게임 설정</h2>

        <section className="setting-group">
          <h3 className="setting-title">난이도</h3>
          <div className="option-row">
            {DIFFICULTIES.map(d => (
              <button
                key={d.id}
                className={'option-btn' + (d.id === difficultyId ? ' selected' : '')}
                onClick={() => onSelectDifficulty(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </section>

        <section className="setting-group">
          <h3 className="setting-title">목숨 개수</h3>
          <div className="option-row">
            {LIVES_OPTIONS.map(n => (
              <button
                key={n}
                className={'option-btn' + (n === startLives ? ' selected' : '')}
                onClick={() => onSelectLives(n)}
              >
                {n}개
              </button>
            ))}
          </div>
        </section>

        <section className="setting-group">
          <h3 className="setting-title">목표 점수</h3>
          <div className="option-row">
            {GOAL_OPTIONS.map(n => (
              <button
                key={n}
                className={'option-btn' + (n === goalScore ? ' selected' : '')}
                onClick={() => onSelectGoal(n)}
              >
                {n}점
              </button>
            ))}
          </div>
        </section>

        <div className="modal-buttons">
          <button className="modal-btn" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomeSettingsModal
