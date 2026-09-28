# 🌈 WORD RAIN — 타이핑 카운터 게임

> 2026 웹프로그래밍 4주차 과제 — **State Hoisting(상태 끌어올리기)** 실습

하늘 위에서 떨어지는 **토익(TOEIC) 영단어**를 정확히 입력해서 점수를 쌓는
타이핑 게임입니다. 원래 과제였던 "카운터 2개"의 아이디어를, 낙하하는 단어를
맞힐 때마다 점수(카운터)가 오르내리는 게임 형태로 확장했습니다.

<br/>

## 🎮 미리보기

| 홈 화면 | 게임 화면 |
| :---: | :---: |
| 테마 선택 · 최고 기록 · 목표 안내 | 낙하하는 단어 · 목숨 · 레벨 · 목표 진행바 |

<br/>

## ✨ 주요 기능

- **테마 3종**: 하늘-땅 ☁️ / 우주 🪐 / 바다 속 🐬 — 정답을 맞히면 테마에 맞는
  이펙트(구름→꽃, 별, 물고기 등)가 터집니다.
- **정확히 입력해야 점수 획득**: 떨어지는 단어와 글자가 하나라도 다르면
  인정되지 않고, 입력창이 흔들리며 오답 메시지가 뜹니다.
- **목숨 & 페널티**: 단어가 바닥에 닿을 때까지 입력하지 못하면 점수 -1,
  목숨(❤️)도 하나 줄어듭니다. 목숨이 0이 되면 게임 오버.
- **레벨 & 난이도**: 정답 8개마다 레벨이 올라가고, 낙하 속도와 스폰 주기가
  점점 빨라집니다.
- **명확한 목표**: 목표 점수(50점)를 달성하면 "미션 성공!" 모달이 뜨고,
  이후에도 계속 플레이하며 최고 기록에 도전할 수 있습니다.
- **최고 기록 저장**: `localStorage`에 저장되어, 다시 접속해도 유지됩니다.
- **게임 설정**: 플레이 중 ⚙️ 버튼으로 재시작(점수 0으로 초기화) 또는
  홈 화면으로 나가기가 가능합니다.
- **말풍선 겹침 방지**: 화면을 6개의 고정 레인으로 나눠 단어를 스폰해
  말풍선끼리 겹치지 않도록 했고, 혹시 겹치더라도 마우스를 올리면 맨 앞으로
  보이도록 처리했습니다.

<br/>

## 🕹️ 조작 방법

1. 홈 화면에서 원하는 테마를 고르고 **시작하기**를 누릅니다.
2. 하늘에서 떨어지는 영단어를 입력창에 그대로 입력합니다. (Enter 불필요,
   글자가 일치하는 순간 자동으로 정답 처리)
3. 오답을 제출하면(Enter) 입력창이 흔들리며 안내 메시지가 뜹니다.
4. 목숨 3개, 목표 점수 50점을 기억하며 최고 기록에 도전하세요!

<br/>

## 🏗️ 기술 스택

- **React 19** + **Vite** (`@vitejs/plugin-react`)
- **Oxlint** — 린트
- 순수 CSS (별도 UI 라이브러리 없이 테마별 배경/애니메이션 직접 구현)
- Google Fonts: `Jua`(제목), `Noto Sans KR`(본문)

<br/>

## 📁 프로젝트 구조

```
src/
├── App.jsx            # 최상위 상태(screen, theme, score, highScore) 관리
├── HomeScreen.jsx      # 테마 선택 / 시작 화면 (프레젠테이션 컴포넌트)
├── GameScreen.jsx      # 낙하 로직, 입력 판정, 목숨/레벨/목표 등 게임 상태
├── WordBubble.jsx      # 낙하하는 단어 말풍선 (상태 없음)
├── PopEffect.jsx       # 정답 시 터지는 이펙트 (상태 없음)
├── SettingsModal.jsx   # 게임 설정(재시작/나가기) 모달
├── themes.js           # 테마 정의 + 토익 영단어 목록
├── App.css / index.css # 스타일
└── main.jsx            # 엔트리 포인트
```

<br/>

## 🧠 State Hoisting (상태 끌어올리기)

이번 과제의 핵심 개념을 다음과 같이 적용했습니다.

- **`App`**: 화면 전환(`screen`), 선택된 테마(`selectedThemeId`), 점수(`score`),
  최고 기록(`highScore`)처럼 **여러 화면이 함께 알아야 하는 상태**를 최상위에서
  관리합니다.
- 자식 컴포넌트(`HomeScreen`, `GameScreen`)는 이 상태를 **props로 전달받고**,
  변경이 필요하면 `onSelectTheme`, `onScoreChange`, `onRestart`, `onExit` 같은
  **콜백 props를 호출**해 `App`에 알립니다.
- 반대로 낙하 단어 목록, 입력값, 목숨, 레벨처럼 **그 화면 안에서만 필요한
  상태**는 해당 컴포넌트(`GameScreen`)가 스스로 들고 있어, 불필요하게 상위로
  끌어올리지 않았습니다.
- `WordBubble`, `PopEffect` 등은 자체 상태 없이 props만으로 그리는 순수
  프레젠테이션 컴포넌트로 분리했습니다.

<br/>

## 🚀 실행 방법

```bash
pnpm install
pnpm run dev       # 개발 서버 실행
pnpm run build     # 프로덕션 빌드
pnpm run lint      # Oxlint 검사
```

<br/>

## 🔭 향후 추가할 기능 (TODO)

- [ ] 다른 친구와 동시 접속해서 같이 하기 (멀티플레이어)
- [ ] 랜덤으로 HP(목숨)를 떨어뜨리는 이벤트 추가하기
- [ ] 학습 모드: 맞춘 단어를 저장해두고, "학습하기" 버튼을 누르면 해당 단어의
      예문과 뜻을 볼 수 있도록 구성하기

<br/>

---

<details>
<summary>Vite + React 템플릿 기본 안내 (원문)</summary>

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

</details>
