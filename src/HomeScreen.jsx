import { useState } from 'react'
import { THEMES } from './themes'
import HomeSettingsModal from './HomeSettingsModal'

const RAIN_CHARS = '01{}<>/;=+#$%&fn()[]'

// 모듈 로드 시 한 번만 계산되는 정적 배경 데이터 (재렌더링 때마다 배치가 바뀌지 않도록)
const RAIN_COLUMNS = Array.from({ length: 16 }, (_, i) => {
  let text = ''
  for (let j = 0; j < 10; j++) {
    text += RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)]
  }
  return {
    left: `${(i / 16) * 100 + Math.random() * 3}%`,
    duration: 7 + Math.random() * 8,
    delay: Math.random() * -10,
    chars: text.split(''),
  }
})

// HomeScreen은 테마/난이도/목숨/목표 같은 선택값과 선택/시작 핸들러를
// props로 전달받아 렌더링만 담당합니다. (그 값들의 상태는 App에서 관리 ->
// state hoisting) 설정 팝업을 열고 닫는 것처럼 이 화면 안에서만 필요한
// UI 상태는 여기서 자체적으로 useState로 들고 있습니다.
function HomeScreen({
  selectedThemeId,
  onSelectTheme,
  difficultyId,
  onSelectDifficulty,
  startLives,
  onSelectLives,
  goalScore,
  onSelectGoal,
  onStart,
  highScore,
}) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div id="home-screen">
      <div className="code-rain" aria-hidden="true">
        {RAIN_COLUMNS.map((c, i) => (
          <div
            key={i}
            className="rain-col"
            style={{
              left: c.left,
              animationDuration: `${c.duration}s`,
              animationDelay: `${c.delay}s`,
            }}
          >
            {c.chars.map((ch, j) => (
              <span key={j}>{ch}</span>
            ))}
          </div>
        ))}
      </div>

      <button
        id="home-settings-button"
        onClick={() => setSettingsOpen(true)}
        aria-label="게임 설정"
      >
        ⚙️ 게임 설정
      </button>

      <div className="avatar">
        <div className="avatar-face">
          <span className="avatar-eye left" />
          <span className="avatar-eye right" />
          <span className="avatar-mouth" />
        </div>
      </div>

      <h1 className="game-title">CODE RAIN</h1>
      <p className="subtitle">
        하늘에서 쏟아지는 토익 영단어를 정확히 입력해서 점수도 쌓고 영어
        타이핑 실력도 늘려보세요!
      </p>

      <p className="high-score">
        🏆 최고 기록 <strong>{highScore}</strong>점
      </p>

      <div className="theme-grid">
        {THEMES.map(theme => (
          <button
            key={theme.id}
            className={
              'theme-card' + (theme.id === selectedThemeId ? ' selected' : '')
            }
            onClick={() => onSelectTheme(theme.id)}
          >
            <span className="theme-emoji">{theme.emoji}</span>
            <span className="theme-name">{theme.name}</span>
            <span className="theme-blurb">{theme.blurb}</span>
          </button>
        ))}
      </div>

      <button id="start-button" onClick={onStart} disabled={!selectedThemeId}>
        시작하기
      </button>

      <p className="hint">
        목표는 <strong>{goalScore}점</strong>! 목숨은 <strong>{startLives}개</strong>,
        글자가 바닥에 닿으면 점수와 목숨이 줄어들고, 정답을 맞힐수록 레벨이
        올라 점점 빨라져요. (⚙️ 게임 설정에서 바꿀 수 있어요)
      </p>

      {settingsOpen && (
        <HomeSettingsModal
          difficultyId={difficultyId}
          onSelectDifficulty={onSelectDifficulty}
          startLives={startLives}
          onSelectLives={onSelectLives}
          goalScore={goalScore}
          onSelectGoal={onSelectGoal}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  )
}

export default HomeScreen
