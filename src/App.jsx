import './App.css'
import { useCallback, useEffect, useState } from 'react'
import HomeScreen from './HomeScreen'
import GameScreen from './GameScreen'
import { getTheme } from './themes'
import { getDifficulty } from './settings'

const HIGH_SCORE_KEY = 'word-rain-high-score'

// App은 화면 전환(screen), 선택된 테마(themeId)/난이도/목숨/목표 점수, 점수(score),
// 최고 기록처럼 여러 화면이 함께 알아야 하는 상태를 최상위에서 관리합니다.
// 자식 컴포넌트들은 이 상태를 props로 전달받고, 변경이 필요하면 콜백 props를
// 호출해 App에 알립니다. (= state hoisting: 상태를 공통 조상으로 끌어올려
// 형제 컴포넌트끼리 공유)
function App() {
  const [screen, setScreen] = useState('home') // 'home' | 'game'
  const [selectedThemeId, setSelectedThemeId] = useState('sky')
  const [difficultyId, setDifficultyId] = useState('normal')
  const [startLives, setStartLives] = useState(4)
  const [goalScore, setGoalScore] = useState(50)
  const [score, setScore] = useState(0)
  const [resetSignal, setResetSignal] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = Number(localStorage.getItem(HIGH_SCORE_KEY))
    return Number.isFinite(saved) ? saved : 0
  })

  useEffect(() => {
    localStorage.setItem(HIGH_SCORE_KEY, String(highScore))
  }, [highScore])

  const handleScoreChange = useCallback(delta => {
    setScore(prev => {
      const next = prev + delta
      setHighScore(prevHigh => Math.max(prevHigh, next))
      return next
    })
  }, [])

  function handleStart() {
    setScore(0)
    setResetSignal(s => s + 1)
    setScreen('game')
  }

  function handleRestart() {
    setScore(0)
    setResetSignal(s => s + 1)
  }

  function handleExit() {
    setScreen('home')
  }

  return (
    <div id="app-root">
      {screen === 'home' && (
        <HomeScreen
          selectedThemeId={selectedThemeId}
          onSelectTheme={setSelectedThemeId}
          difficultyId={difficultyId}
          onSelectDifficulty={setDifficultyId}
          startLives={startLives}
          onSelectLives={setStartLives}
          goalScore={goalScore}
          onSelectGoal={setGoalScore}
          onStart={handleStart}
          highScore={highScore}
        />
      )}

      {screen === 'game' && (
        <GameScreen
          key={resetSignal}
          theme={getTheme(selectedThemeId)}
          difficulty={getDifficulty(difficultyId)}
          startLives={startLives}
          goalScore={goalScore}
          score={score}
          onScoreChange={handleScoreChange}
          onRestart={handleRestart}
          onExit={handleExit}
        />
      )}
    </div>
  )
}

export default App
