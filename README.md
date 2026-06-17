# Flappy Bird

Vite + TypeScript + Pixi.js + Matter.js로 만든 독립형 웹 미니게임입니다.

## 실행 방법

```bash
pnpm install
pnpm dev
```

브라우저에서 `http://localhost:3000` 접속

## 게임 방법

- **시작**: 시작 버튼 클릭 또는 스페이스바
- **점프**: 마우스 클릭 / 터치 / 스페이스바
- **목표**: 파이프 사이를 통과해 점수를 올리세요

## 기술 스택

| 역할 | 라이브러리 |
|---|---|
| 렌더링 | [Pixi.js](https://pixijs.com/) v8 |
| 물리 엔진 | [Matter.js](https://brm.io/matter-js/) v0.20 |
| 빌드 도구 | [Vite](https://vitejs.dev/) v6 |
| 언어 | TypeScript |

## 프로젝트 구조

```
src/
├── main.ts                  # 진입점
├── game/
│   ├── FlappyBirdGame.ts    # 게임 메인 클래스
│   ├── constants.ts         # 게임 설정값
│   ├── types.ts             # 공통 타입
│   ├── objects/
│   │   ├── Player.ts        # 플레이어 캐릭터
│   │   ├── Pipe.ts          # 파이프 장애물
│   │   ├── Ground.ts        # 바닥
│   │   └── Ceiling.ts       # 천장
│   ├── scenes/
│   │   ├── ReadyScene.ts    # 시작 화면
│   │   ├── PlayingScene.ts  # 게임 화면
│   │   └── GameOverScene.ts # 게임 오버 화면
│   └── ui/
│       ├── createButton.ts  # 버튼 생성 헬퍼
│       └── createText.ts    # 텍스트 생성 헬퍼
└── style.css
```

## 스크립트

```bash
pnpm dev      # 개발 서버 실행
pnpm build    # 프로덕션 빌드
pnpm preview  # 빌드 결과 미리보기
pnpm lint     # ESLint 검사
pnpm format   # Prettier 포맷
```
