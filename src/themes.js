// 테마별 배경/이펙트를 정의합니다. 떨어지는 단어는 테마와 상관없이
// 토익(TOEIC)에 자주 나오는 비즈니스 영어 단어 목록을 공통으로 사용합니다.
export const WORD_BANK = [
  'invoice', 'budget', 'contract', 'deadline', 'client', 'meeting',
  'schedule', 'warehouse', 'shipment', 'revenue', 'discount', 'negotiate',
  'vendor', 'proposal', 'inventory', 'salary', 'employee', 'manager',
  'conference', 'deposit', 'receipt', 'delivery', 'quarter', 'marketing',
  'strategy', 'announce', 'approve', 'attach', 'benefit', 'candidate',
  'colleague', 'commute', 'document', 'expense', 'feedback', 'finance',
  'insurance', 'itinerary', 'logistics', 'merger', 'notify', 'overtime',
  'permit', 'policy', 'promote', 'purchase', 'recruit', 'renew',
  'resume', 'retail', 'supervisor', 'transaction', 'warranty',
]

export const THEMES = [
  {
    id: 'sky',
    name: '하늘 - 땅',
    emoji: '☁️',
    className: 'theme-sky',
    blurb: '포근한 구름과 들판',
  },
  {
    id: 'space',
    name: '우주',
    emoji: '🪐',
    className: 'theme-space',
    blurb: '별이 쏟아지는 은하수',
  },
  {
    id: 'ocean',
    name: '바다 속',
    emoji: '🐬',
    className: 'theme-ocean',
    blurb: '물고기 헤엄치는 깊은 바다',
  },
]

const OCEAN_ICONS = ['🐟', '🐠', '🐡', '🐬', '🦈']

// 정답을 맞혀 단어가 사라질 때 뜨는 이펙트 아이콘.
// 하늘 테마는 높은 곳(위쪽)에서 잡으면 구름, 바닥 가까이서 잡으면 꽃,
// 우주는 항상 별, 바다는 물고기/돌고래 등을 id 기반으로 고정 배정합니다.
export function getWordIcon(theme, word) {
  if (theme.id === 'sky') return word.y > 55 ? '🌸' : '☁️'
  if (theme.id === 'space') return '⭐'
  if (theme.id === 'ocean') return OCEAN_ICONS[word.id % OCEAN_ICONS.length]
  return '✨'
}

export function getTheme(id) {
  return THEMES.find(t => t.id === id) ?? THEMES[0]
}
