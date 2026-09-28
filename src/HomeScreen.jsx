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
        <svg viewBox="0 0 500 340" className="rainbow-svg" fill="none" aria-hidden="true">
          <g clipPath="url(#rainbow-clip)">
            <path d="M30 300C30 241.652 53.1785 185.695 94.4365 144.437C135.695 103.179 191.652 80 250 80C308.348 80 364.306 103.179 405.564 144.437C446.822 185.695 470 241.652 470 300" stroke="#FF4D5A" strokeWidth="22" strokeLinecap="round" />
            <path d="M48 301C48 246.896 69.5455 195.008 107.897 156.75C146.248 118.493 198.263 97 252.5 97C306.737 97 358.752 118.493 397.103 156.75C435.455 195.008 457 246.896 457 301" stroke="#FF8A34" strokeWidth="22" strokeLinecap="round" />
            <path d="M64 300.5C64 251.17 83.8071 203.86 119.064 168.978C154.321 134.096 202.139 114.5 252 114.5C301.861 114.5 349.679 134.096 384.936 168.978C420.193 203.86 440 251.17 440 300.5" stroke="#FFD84A" strokeWidth="22" strokeLinecap="round" />
            <path d="M80 300.5C80 256.474 98.0687 214.251 130.231 183.12C162.394 151.989 206.015 134.5 251.5 134.5C296.985 134.5 340.606 151.989 372.769 183.12C404.931 214.251 423 256.474 423 300.5" stroke="#50C878" strokeWidth="22" strokeLinecap="round" />
            <path d="M95 301C95 261.748 111.436 224.104 140.691 196.348C169.947 168.593 209.626 153 251 153C292.374 153 332.053 168.593 361.309 196.348C390.564 224.104 407 261.748 407 301" stroke="#3EA6FF" strokeWidth="22" strokeLinecap="round" />
            <path d="M112 301C112 267.052 126.592 234.495 152.566 210.49C178.54 186.486 213.768 173 250.5 173C287.232 173 322.46 186.486 348.434 210.49C374.408 234.495 389 267.052 389 301" stroke="#5B6CFF" strokeWidth="22" strokeLinecap="round" />
            <path d="M128 301C128 271.826 140.748 243.847 163.44 223.218C186.132 202.589 216.909 191 249 191C281.091 191 311.868 202.589 334.56 223.218C357.252 243.847 370 271.826 370 301" stroke="#A855F7" strokeWidth="22" strokeLinecap="round" />
            <path d="M8 320.19C8 301.19 24 286.19 44 286.19C51 265.19 71 251.19 94 253.19C118 255.19 136 270.19 140 290.19C159 290.19 174 303.19 174 320.19C174 332.19 165 340.19 152 340.19H30C17 340.19 8 332.19 8 320.19Z" fill="white" />
            <path d="M334 320.19C334 301.19 350 286.19 370 286.19C377 265.19 397 251.19 420 253.19C444 255.19 462 270.19 466 290.19C485 290.19 500 303.19 500 320.19C500 332.19 491 340.19 478 340.19H356C343 340.19 334 332.19 334 320.19Z" fill="white" />
          </g>
          <defs>
            <clipPath id="rainbow-clip">
              <rect width="500" height="340" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      <h1 className="game-title">WORD RAIN</h1>
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
