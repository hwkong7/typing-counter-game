// 게임 설정 화면(모달). 재시작/나가기 동작은 모두 App -> GameScreen을 거쳐
// props로 전달된 콜백을 호출할 뿐, 자체 상태를 갖지 않습니다.
function SettingsModal({ onResume, onRestart, onExit }) {
  return (
    <div className="modal-overlay" onClick={onResume}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>게임 설정</h2>
        <div className="modal-buttons">
          <button className="modal-btn" onClick={onResume}>
            계속하기
          </button>
          <button className="modal-btn" onClick={onRestart}>
            게임 재시작
          </button>
          <button className="modal-btn danger" onClick={onExit}>
            게임 나가기
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
