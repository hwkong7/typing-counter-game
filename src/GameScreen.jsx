import { useEffect, useRef, useState } from 'react'
import WordBubble from './WordBubble'
import PopEffect from './PopEffect'
import SettingsModal from './SettingsModal'
import { WORD_BANK, getWordIcon } from './themes'

const WORDS_PER_LEVEL = 12
const TICK_MS = 30
const SHAKE_MS = 400
const LANE_X = [8, 24, 40, 56, 72, 88] // 말풍선이 겹치지 않도록 고정된 x 위치(레인)
const LANE_CLEAR_Y = 22 // 레인이 이 높이를 지나야 같은 레인에 다음 단어를 스폰
const HANGUL_REGEX = /[ㄱ-ㆎ가-힣]/ // 한/영 키가 한글 모드일 때 감지용

// 레벨이 오를수록 난이도 설정에 맞춰 조금씩 빨라지고 촘촘해지도록 계산
function fallSpeedForLevel(difficulty, level) {
  return difficulty.fallBase + (level - 1) * difficulty.fallStep
}
function spawnIntervalForLevel(difficulty, level) {
  return Math.max(
    difficulty.spawnMin,
    difficulty.spawnBase - (level - 1) * difficulty.spawnStep,
  )
}

// GameScreen은 낙하 단어 목록, 입력값, 이펙트, 목숨/레벨처럼 이 화면 안에서만
// 필요한 상태는 스스로 관리하고, 점수(score)나 난이도/목숨/목표 점수처럼
// 홈 화면에서 고르고 여러 화면이 함께 알아야 하는 값은 props로 전달받아
// 사용합니다. -> state hoisting
function GameScreen({
  theme,
  difficulty,
  startLives,
  goalScore,
  score,
  onScoreChange,
  onRestart,
  onExit,
}) {
  const [words, setWords] = useState([])
  const [input, setInput] = useState('')
  const [effects, setEffects] = useState([])
  const [feedback, setFeedback] = useState(null) // 오답일 때만 사용
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [lives, setLives] = useState(startLives)
  const [correctCount, setCorrectCount] = useState(0)
  const [dismissedSuccess, setDismissedSuccess] = useState(false)
  const [shake, setShake] = useState(false)

  const nextIdRef = useRef(0)
  const shakeTimeoutRef = useRef(null)

  const level = Math.floor(correctCount / WORDS_PER_LEVEL) + 1
  const gameOver = lives <= 0
  // 목표 점수를 넘으면 (다시 닫기 전까지) 성공 모달을 보여준다
  const showSuccessModal = score >= goalScore && !dismissedSuccess
  const paused = settingsOpen || gameOver || showSuccessModal

  function triggerShake() {
    setShake(true)
    clearTimeout(shakeTimeoutRef.current)
    shakeTimeoutRef.current = setTimeout(() => setShake(false), SHAKE_MS)
  }

  // 단어 낙하 애니메이션 루프
  useEffect(() => {
    if (paused) return

    const tick = setInterval(() => {
      setWords(prev => {
        const next = []
        let missed = 0
        for (const w of prev) {
          const y = w.y + fallSpeedForLevel(difficulty, level)
          if (y >= 92) {
            missed += 1
          } else {
            next.push({ ...w, y })
          }
        }
        if (missed > 0) {
          onScoreChange(-missed)
          setLives(prev => Math.max(0, prev - missed))
          triggerShake()
        }
        return next
      })
    }, TICK_MS)

    return () => clearInterval(tick)
  }, [paused, level, difficulty, onScoreChange])

  // 단어 생성 루프
  useEffect(() => {
    if (paused) return

    const spawn = setInterval(() => {
      setWords(prev => {
        // 위쪽(LANE_CLEAR_Y 이내)에 이미 단어가 있는 레인은 피해서, 말풍선끼리
        // 서로 겹치지 않도록 고정된 레인 중 비어 있는 곳에만 새 단어를 스폰한다.
        const occupiedLanes = new Set(
          prev.filter(w => w.y < LANE_CLEAR_Y).map(w => w.lane),
        )
        const availableLanes = LANE_X.map((_, i) => i).filter(
          i => !occupiedLanes.has(i),
        )
        if (availableLanes.length === 0) return prev

        const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)]
        const text = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]
        const word = {
          id: nextIdRef.current++,
          text,
          lane,
          x: LANE_X[lane],
          y: 0,
        }
        return [...prev, word]
      })
    }, spawnIntervalForLevel(difficulty, level))

    return () => clearInterval(spawn)
  }, [paused, level, difficulty])

  // 오답 피드백 메시지 자동 소멸
  useEffect(() => {
    if (!feedback) return
    const t = setTimeout(() => setFeedback(null), 900)
    return () => clearTimeout(t)
  }, [feedback])

  // 언마운트 시 흔들림 타이머 정리
  useEffect(() => {
    return () => clearTimeout(shakeTimeoutRef.current)
  }, [])

  function spawnEffect(word) {
    const id = nextIdRef.current++
    const icon = getWordIcon(theme, word)
    setEffects(prev => [...prev, { id, x: word.x, y: word.y, icon }])
    setTimeout(() => {
      setEffects(prev => prev.filter(e => e.id !== id))
    }, 600)
  }

  function tryMatch(value) {
    const matchIndex = words.findIndex(w => w.text === value)
    if (matchIndex !== -1) {
      const word = words[matchIndex]
      setWords(prev => prev.filter(w => w.id !== word.id))
      onScoreChange(1)
      setCorrectCount(prev => prev + 1)
      spawnEffect(word)
      setInput('')
    }
  }

  function handleChange(e) {
    const raw = e.target.value

    // 한/영 키가 한글 모드일 때 실수로 입력하면 즉시 알려주고 비운다.
    if (HANGUL_REGEX.test(raw)) {
      setInput('')
      setFeedback({ text: '한/영 키를 눌러 영어로 입력해주세요!' })
      triggerShake()
      return
    }

    // 항상 소문자로 고정해서 보여준다 (Caps Lock 등으로 대문자가 섞여도 안전)
    const value = raw.toLowerCase()
    setInput(value)
    // 한글 등 조합 입력(IME) 도중에는 값을 지우면 마지막 글자가 다음 입력에
    // 들러붙는 문제가 생기므로, 조합이 끝난 뒤(onCompositionEnd)에만 검사한다.
    if (e.nativeEvent.isComposing) return
    tryMatch(value)
  }

  function handleCompositionEnd(e) {
    if (HANGUL_REGEX.test(e.target.value)) return
    tryMatch(e.target.value.toLowerCase())
  }

  function handleKeyDown(e) {
    if (e.key !== 'Enter') return
    if (!input) return
    const exists = words.some(w => w.text === input)
    if (!exists) {
      setFeedback({ text: `"${input}"은(는) 틀렸어요!` })
      setInput('')
      triggerShake()
    }
  }

  function restartGame() {
    setWords([])
    setInput('')
    setEffects([])
    setFeedback(null)
    setLives(startLives)
    setCorrectCount(0)
    setDismissedSuccess(false)
    onRestart()
  }

  return (
    <div className={`game-screen ${theme.className}`}>
      <div className="game-header">
        <div className="header-stats">
          <span className="score-board">점수 {score}</span>
          <span className="level-badge">Lv.{level}</span>
          <span className="lives">
            {Array.from({ length: startLives }).map((_, i) => (
              <span key={i} className={i < lives ? 'heart' : 'heart empty'}>
                {i < lives ? '❤️' : '🤍'}
              </span>
            ))}
          </span>
        </div>
        <button
          className="settings-icon-btn"
          onClick={() => setSettingsOpen(true)}
          aria-label="게임 설정"
        >
          ⚙️
        </button>
      </div>

      <div className="goal-bar">
        <div
          className="goal-bar-fill"
          style={{ width: `${Math.min(100, (Math.max(score, 0) / goalScore) * 100)}%` }}
        />
        <span className="goal-bar-label">
          목표 {Math.max(score, 0)} / {goalScore}
        </span>
      </div>

      <div className="game-field">
        {words.map(w => (
          <WordBubble
            key={w.id}
            word={w}
            matchedLength={w.text.startsWith(input) ? input.length : 0}
          />
        ))}
        {effects.map(e => (
          <PopEffect key={e.id} effect={e} icon={e.icon} />
        ))}
        {feedback && <div className="feedback feedback-bad">{feedback.text}</div>}
      </div>

      <div className="input-bar">
        <input
          className={shake ? 'shake' : ''}
          type="text"
          value={input}
          onChange={handleChange}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={handleKeyDown}
          placeholder="떨어지는 토익 영단어를 입력하세요"
          autoFocus
          disabled={gameOver}
        />
      </div>

      {settingsOpen && !gameOver && !showSuccessModal && (
        <SettingsModal
          onResume={() => setSettingsOpen(false)}
          onRestart={() => {
            setSettingsOpen(false)
            restartGame()
          }}
          onExit={onExit}
        />
      )}

      {showSuccessModal && !gameOver && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🎉 미션 성공!</h2>
            <p className="final-score">목표 {goalScore}점을 넘었어요! (현재 {score}점)</p>
            <div className="modal-buttons">
              <button className="modal-btn" onClick={() => setDismissedSuccess(true)}>
                계속 플레이
              </button>
              <button className="modal-btn danger" onClick={onExit}>
                홈으로
              </button>
            </div>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>게임 오버</h2>
            <p className="final-score">최종 점수: {score}</p>
            <div className="modal-buttons">
              <button className="modal-btn" onClick={restartGame}>
                다시하기
              </button>
              <button className="modal-btn danger" onClick={onExit}>
                홈으로
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameScreen
