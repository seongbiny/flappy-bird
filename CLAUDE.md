# CLAUDE.md

## 프로젝트 개요

이 프로젝트는 `Flappy Bird` 스타일의 독립형 웹 미니게임이다.

플레이어는 새 캐릭터를 조작해 파이프 장애물 사이를 통과해야 한다. 캐릭터는 중력에 의해 아래로 떨어지고, 플레이어가 클릭, 터치, 스페이스바 입력을 하면 위로 점프한다.

이 프로젝트는 MVP 기준으로 개발한다.
목표는 예쁜 디자인이 아니라 **플레이 가능한 최소 버전의 게임을 완성하는 것**이다.

## 기술 스택

이 프로젝트는 아래 기술을 사용한다.

* Vite
* TypeScript
* Pixi.js
* Matter.js
* ESLint
* Prettier

역할은 아래처럼 나눈다.

```txt
Pixi.js
- 화면 렌더링
- 캐릭터, 파이프, 바닥, 점수, 버튼 표시

Matter.js
- 중력 적용
- 점프 처리
- 충돌 판정
- Player, Pipe, Ground, Ceiling Body 관리
```

초기 MVP에서는 React를 사용하지 않는다.

## MVP 목표

이번 MVP의 목표는 아래 기능이 동작하는 가장 작은 게임을 완성하는 것이다.

* 시작 화면
* 게임 시작
* 캐릭터 중력 적용
* 클릭, 터치, 스페이스바 점프
* 파이프 장애물 생성
* 파이프 장애물 이동
* 충돌 판정
* 점수 증가
* 게임 오버
* 다시 시작

## MVP 범위 밖 기능

아래 기능은 MVP에서 만들지 않는다.

* React
* React Router
* Supabase
* 로그인
* 랭킹
* 서버 연동
* 최고 점수 저장
* 사운드
* 배경음
* 캐릭터 애니메이션
* 배경 스크롤
* 바닥 스크롤
* 난이도 증가
* 캐릭터 선택
* 상점
* 광고
* 결제 기능
* 고퀄리티 디자인
* 외부 이미지 에셋 중심 구현

요청받기 전까지 MVP 범위 밖 기능을 임의로 추가하지 않는다.

## 게임 규칙

* 게임은 `ready`, `playing`, `gameOver` 상태를 가진다.
* 시작 화면에서 시작 버튼 또는 입력으로 게임을 시작한다.
* 플레이어 캐릭터는 Matter.js 중력에 의해 아래로 떨어진다.
* 클릭, 터치, 스페이스바 입력 시 캐릭터가 위로 점프한다.
* 파이프는 오른쪽에서 왼쪽으로 이동한다.
* 캐릭터가 파이프 사이를 통과하면 점수가 1점 증가한다.
* 캐릭터가 파이프, 바닥, 천장에 닿으면 게임 오버가 된다.
* 게임 오버 화면에서는 최종 점수를 보여준다.
* 다시 시작 버튼을 누르면 게임을 처음부터 다시 시작한다.

## 게임 상태

게임 상태는 MVP 기준으로 3개만 사용한다.

```ts
export type GameStatus = 'ready' | 'playing' | 'gameOver';
```

상태별 역할은 아래와 같다.

```txt
ready
- 시작 화면을 보여준다.
- 캐릭터와 파이프는 움직이지 않는다.
- 시작 버튼 또는 입력으로 playing 상태가 된다.

playing
- Matter.js 물리 업데이트가 동작한다.
- 캐릭터에 중력이 적용된다.
- 입력 시 캐릭터가 점프한다.
- 파이프가 이동한다.
- 점수 계산을 수행한다.
- 충돌 판정을 수행한다.

gameOver
- 게임 진행을 멈춘다.
- 최종 점수를 보여준다.
- 다시 시작 버튼을 보여준다.
```

## 추천 프로젝트 구조

```txt
flappy-bird/
├─ public/
├─ src/
│  ├─ main.ts
│  ├─ style.css
│  ├─ game/
│  │  ├─ FlappyBirdGame.ts
│  │  ├─ constants.ts
│  │  ├─ types.ts
│  │  ├─ objects/
│  │  │  ├─ Player.ts
│  │  │  ├─ Pipe.ts
│  │  │  ├─ Ground.ts
│  │  │  └─ Ceiling.ts
│  │  ├─ scenes/
│  │  │  ├─ ReadyScene.ts
│  │  │  ├─ PlayingScene.ts
│  │  │  └─ GameOverScene.ts
│  │  └─ ui/
│  │     ├─ createButton.ts
│  │     └─ createText.ts
│  └─ shared/
│     └─ utils/
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
├─ prd.md
├─ spec.md
├─ CLAUDE.md
└─ README.md
```

## 게임 생명주기

게임 클래스는 아래 생명주기를 가진다.

```ts
export interface GameInstance {
  init: (container: HTMLElement) => Promise<void>;
  start: () => void;
  restart: () => void;
  destroy: () => void;
}
```

`FlappyBirdGame` 클래스는 전체 게임 흐름을 관리한다.

주요 책임:

* Pixi Application 생성
* Matter Engine 생성
* 게임 상태 관리
* Scene 전환 관리
* Player 생성
* Pipe 생성 및 제거
* Ground 생성
* Ceiling 생성
* 입력 이벤트 등록 및 제거
* Matter.js 충돌 이벤트 등록 및 제거
* 점수 관리
* 게임 오버 처리
* 다시 시작 처리
* 리소스 정리

## 게임 설정값 관리

반복되는 값은 `constants.ts`에 둔다.

예시:

```ts
export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,

  PLAYER_X: 200,
  PLAYER_START_Y: 300,
  PLAYER_SIZE: 32,

  GRAVITY_Y: 1,
  JUMP_VELOCITY: -8,

  PIPE_WIDTH: 80,
  PIPE_GAP_HEIGHT: 180,
  PIPE_SPEED: 3,
  PIPE_SPAWN_INTERVAL: 1500,

  GROUND_HEIGHT: 80,
};
```

값은 구현하면서 플레이 감각에 맞게 조정할 수 있다.

## Pixi.js 작성 규칙

* Pixi Application은 `FlappyBirdGame.init()`에서 생성한다.
* Pixi canvas는 전달받은 container에 붙인다.
* MVP에서는 이미지 에셋 없이 Pixi Graphics와 Text를 사용한다.
* Player는 원 또는 사각형으로 표현해도 된다.
* Pipe는 사각형으로 표현한다.
* Ground는 하단 사각형으로 표현한다.
* Score는 Pixi Text로 표시한다.
* 버튼은 Pixi Graphics와 Pixi Text를 조합해서 만든다.
* Scene 전환 시 이전 Scene의 container를 제거하거나 destroy한다.
* Pixi 리소스는 `destroy()`에서 정리한다.

## Matter.js 작성 규칙

* Matter Engine은 `FlappyBirdGame`에서 생성한다.
* Player는 동적 Body로 만든다.
* Pipe, Ground, Ceiling은 정적 Body로 만든다.
* Player는 Matter.js 중력 영향을 받는다.
* Pipe는 중력 영향을 받으면 안 된다.
* Pipe는 `Body.setPosition()` 등을 이용해 직접 왼쪽으로 이동시킨다.
* 클릭, 터치, 스페이스바 입력 시 Player Body의 y velocity를 음수 값으로 바꿔 점프시킨다.
* 충돌 판정은 Matter.js `collisionStart` 이벤트를 사용한다.
* MVP에서는 Player가 Pipe, Ground, Ceiling 중 하나와 충돌하면 모두 게임 오버로 처리한다.
* Matter 이벤트 리스너는 중복 등록되지 않게 관리한다.
* 게임 재시작 또는 destroy 시 Matter World, Body, 이벤트를 정리한다.

## Pixi.js와 Matter.js 동기화 규칙

Matter.js Body가 실제 위치의 기준이다.

매 프레임마다 Pixi 객체는 Matter.js Body의 위치를 따라가야 한다.

```ts
graphic.x = body.position.x;
graphic.y = body.position.y;
graphic.rotation = body.angle;
```

Player와 Pipe 모두 이 규칙을 따른다.

## 입력 처리 규칙

입력 방식은 아래 세 가지를 지원한다.

* 마우스 클릭
* 터치
* 스페이스바

상태별 입력 처리는 아래처럼 한다.

```txt
ready 상태
- 입력 시 게임 시작

playing 상태
- 입력 시 player.jump()

gameOver 상태
- 일반 입력은 무시
- 다시 시작은 버튼으로 처리
```

입력 이벤트는 게임 초기화 시 등록하고, destroy 시 반드시 제거한다.

## 점수 규칙

* 파이프 한 쌍을 통과하면 점수가 1점 증가한다.
* 한 파이프 쌍은 한 번만 점수를 줄 수 있다.
* Pipe 객체는 `scored` 값을 가진다.
* Pipe가 Player의 x 좌표보다 왼쪽으로 지나갔고, 아직 점수를 주지 않았다면 점수를 1점 증가시킨다.

예시 조건:

```txt
pipe.x + pipe.width / 2 < player.x
그리고
pipe.scored === false
```

## 게임 루프 규칙

Pixi ticker에서 게임 루프를 실행한다.

`playing` 상태일 때만 아래 작업을 수행한다.

```txt
1. Matter Engine 업데이트
2. Pipe 생성 타이밍 확인
3. Pipe 이동
4. Player 위치 동기화
5. Pipe 위치 동기화
6. 점수 계산
7. 화면 밖 Pipe 제거
```

`ready` 또는 `gameOver` 상태에서는 게임 진행 업데이트를 하지 않는다.

## 재시작 규칙

다시 시작 시 아래 작업을 수행한다.

```txt
1. 기존 Pipe 제거
2. 기존 Player 제거
3. Matter World 초기화
4. 점수 0으로 초기화
5. Player 새로 생성
6. Ground 새로 생성
7. Ceiling 새로 생성
8. 상태를 playing으로 변경
```

재시작 후 이전 Body나 Pixi 객체가 화면 또는 Matter World에 남아 있으면 안 된다.

## 정리 규칙

`destroy()`에서는 아래 작업을 수행한다.

```txt
1. Pixi ticker 제거
2. 입력 이벤트 제거
3. Matter 이벤트 제거
4. Matter World Body 제거
5. Pixi stage children 제거
6. Pixi Application destroy
```

주의사항:

* 이벤트 리스너는 중복 등록되지 않게 한다.
* destroy는 여러 번 호출되어도 치명적인 에러가 나지 않게 작성한다.
* 게임 재시작 시 기존 Body와 Graphics가 남지 않게 한다.

## TypeScript 작성 규칙

* TypeScript를 사용한다.
* 가능한 한 `any` 사용을 피한다.
* 변수명과 함수명은 의미가 분명하게 작성한다.
* 반복되는 값은 상수로 분리한다.
* 게임 설정값은 `constants.ts`에 둔다.
* 공통 타입은 `types.ts`에 둔다.
* Player, Pipe, Ground, Ceiling은 각각 별도 파일로 분리한다.
* 한 파일이 너무 커지지 않도록 역할별로 나눈다.
* 복잡한 추상화는 MVP 이후에 고려한다.

## 개발 우선순위

구현은 아래 순서로 진행한다.

```txt
1. Vite + TypeScript 프로젝트 생성
2. Pixi.js 화면 띄우기
3. Matter.js Engine 생성
4. Player Body와 Graphics 생성
5. 중력 적용 확인
6. 점프 입력 구현
7. Ground / Ceiling 충돌 구현
8. Pipe 생성
9. Pipe 이동
10. Player와 Pipe 충돌 구현
11. 점수 증가 구현
12. GameOverScene 구현
13. 다시 시작 구현
14. 리소스 정리 확인
```

## 테스트 체크리스트

MVP 완료 전 아래 항목을 확인한다.

```txt
[ ] pnpm dev로 게임이 실행된다.
[ ] 시작 화면이 표시된다.
[ ] 시작 버튼으로 게임을 시작할 수 있다.
[ ] 스페이스바로 게임을 시작할 수 있다.
[ ] playing 상태에서 클릭 시 캐릭터가 점프한다.
[ ] playing 상태에서 터치 시 캐릭터가 점프한다.
[ ] playing 상태에서 스페이스바 입력 시 캐릭터가 점프한다.
[ ] 캐릭터가 중력에 의해 아래로 떨어진다.
[ ] 파이프가 오른쪽에서 왼쪽으로 이동한다.
[ ] 파이프 사이를 통과하면 점수가 1점 증가한다.
[ ] 파이프에 닿으면 게임 오버가 된다.
[ ] 바닥에 닿으면 게임 오버가 된다.
[ ] 천장에 닿으면 게임 오버가 된다.
[ ] 게임 오버 화면에 최종 점수가 표시된다.
[ ] 다시 시작 버튼으로 게임을 재시작할 수 있다.
[ ] 재시작 후 점수가 0으로 초기화된다.
[ ] 재시작 후 기존 파이프가 남아있지 않다.
[ ] 콘솔에 치명적인 에러가 없다.
```

## 문서 관리 규칙

아래 문서를 유지한다.

* `prd.md`: MVP 요구사항
* `spec.md`: 구현 명세
* `CLAUDE.md`: Claude Code 작업 규칙
* `README.md`: 프로젝트 소개와 실행 방법

구현 중 PRD나 Spec과 다른 판단을 해야 할 경우, 먼저 문서를 수정하고 그 기준에 맞춰 코드를 작성한다.

## Git 규칙

브랜치는 단순하게 사용한다.

```txt
main
chore/init-project
feat/game-core
feat/player
feat/pipe
feat/collision
feat/score
feat/restart
fix/matter-cleanup
docs/update-spec
```

커밋 메시지 예시:

```txt
docs: add mvp prd and spec
chore: initialize flappy bird project
feat: setup pixi application
feat: setup matter engine
feat: add player jump
feat: add pipe obstacle
feat: detect collision with matter
feat: add score system
feat: add restart flow
fix: cleanup matter bodies on restart
```
