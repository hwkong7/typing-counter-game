// 홈 화면에서 고를 수 있는 게임 설정값(난이도/목숨/목표 점수)의 기준 데이터.
// 실제 선택된 값은 App이 상태로 들고 있다가 GameScreen에 props로 내려줍니다.
export const DIFFICULTIES = [
  {
    id: 'easy',
    label: '쉬움',
    fallBase: 0.055,
    fallStep: 0.008,
    spawnBase: 2200,
    spawnStep: 60,
    spawnMin: 1200,
  },
  {
    id: 'normal',
    label: '보통',
    fallBase: 0.075,
    fallStep: 0.012,
    spawnBase: 1900,
    spawnStep: 80,
    spawnMin: 900,
  },
  {
    id: 'hard',
    label: '어려움',
    fallBase: 0.11,
    fallStep: 0.018,
    spawnBase: 1500,
    spawnStep: 100,
    spawnMin: 650,
  },
]

export const LIVES_OPTIONS = [3, 4, 5, 6]
export const GOAL_OPTIONS = [30, 50, 80, 100]

export function getDifficulty(id) {
  return DIFFICULTIES.find(d => d.id === id) ?? DIFFICULTIES[1]
}
