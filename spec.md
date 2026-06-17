# Flappy Bird MVP Spec

## 1. 기술 스택

이 프로젝트는 독립형 웹 미니게임으로 개발한다.

사용 기술:

* Vite
* TypeScript
* Pixi.js
* Matter.js
* ESLint
* Prettier

역할 분리:

```txt
Pixi.js
- 화면 렌더링
- 캐릭터, 파이프, 바닥, 점수, 버튼 표시

Matter.js
- 중력 적용
- 점프 물리 처리
- 충돌 판정
- Player, Pipe, Ground, Ceiling Body 관리
```

초기 버전에서는 React를 사용하지 않는다.

---

## 2. 프로젝트 구조

추천 구조는 아래와 같다.

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

---

## 3. 실행 방식

`main.ts`에서는 `#app` DOM 요소를 찾고, `FlappyBirdGame`을 생성해 실행한다.

```ts
const container = document.querySelector<HTMLDivElement>('#app');

if (!container) {
  throw new Error('App container not found');
}

const game = new FlappyBirdGame();

await game.init(container);
game.start();
```

---

## 4. 게임 생명주기

게임 클래스는 아래 생명주기를 가진다.

```ts
export interface GameInstance {
  init: (container: HTMLElement) => Promise<void>;
  start: () => void;
  restart: () => void;
  destroy: () => void;
}
```

### FlappyBirdGame 역할

`FlappyBirdGame`은 전체 게임 흐름을 관리한다.

책임:

* Pixi Application 생성
* Matter Engine 생성
* 게임 상태 관리
* Scene 전환 관리
* Player, Pipe, Ground, Ceiling 생성
* 입력 이벤트 관리
* 충돌 이벤트 관리
* 점수 관리
* 게임 재시작 처리
* Pixi.js / Matter.js 리소스 정리

---

## 5. 게임 상태

게임 상태는 MVP 기준으로 3개만 사용한다.

```ts
export type GameStatus = 'ready' | 'playing' | 'gameOver';
```

상태 설명:

```txt
ready       시작 전
playing     게임 진행 중
gameOver    게임 오버
```

상태 전환:

```txt
ready
  └─ start
      → playing

playing
  ├─ collision
  │   → gameOver
  └─ fall / ceiling hit
      → gameOver

gameOver
  └─ restart
      → ready 또는 playing
```

MVP에서는 다시 시작 버튼을 누르면 바로 `playing`으로 시작해도 된다.

---

## 6. 게임 설정값

게임 설정값은 `constants.ts`에 둔다.

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

---

## 7. Matter.js 설계

### 7.1 Engine

게임 시작 시 Matter.js Engine을 생성한다.

```ts
this.engine = Engine.create();
this.world = this.engine.world;
```

중력은 y축 방향으로 적용한다.

```ts
this.engine.gravity.y = GAME_CONFIG.GRAVITY_Y;
```

### 7.2 Player Body

Player는 동적 Body로 만든다.

```ts
Bodies.rectangle(x, y, width, height, {
  label: 'player',
});
```

Player는 중력 영향을 받는다.

입력 시 아래 방식으로 점프한다.

```ts
Body.setVelocity(player.body, {
  x: 0,
  y: GAME_CONFIG.JUMP_VELOCITY,
});
```

### 7.3 Pipe Body

Pipe는 위쪽 파이프와 아래쪽 파이프 한 쌍으로 만든다.

파이프는 중력 영향을 받지 않아야 하므로 정적 Body로 만든다.

```ts
Bodies.rectangle(x, y, width, height, {
  isStatic: true,
  label: 'pipe',
});
```

파이프는 직접 x 좌표를 이동시킨다.

```ts
Body.setPosition(pipe.body, {
  x: pipe.body.position.x - GAME_CONFIG.PIPE_SPEED,
  y: pipe.body.position.y,
});
```

### 7.4 Ground Body

Ground는 화면 하단에 고정된 정적 Body다.

```ts
Bodies.rectangle(x, y, width, height, {
  isStatic: true,
  label: 'ground',
});
```

### 7.5 Ceiling Body

Ceiling은 화면 상단에 고정된 정적 Body다.

```ts
Bodies.rectangle(x, y, width, height, {
  isStatic: true,
  label: 'ceiling',
});
```

---

## 8. Pixi.js 렌더링 설계

각 Matter Body에 대응하는 Pixi Graphics를 만든다.

매 프레임마다 Matter Body의 위치를 Pixi 객체에 반영한다.

```ts
graphic.x = body.position.x;
graphic.y = body.position.y;
graphic.rotation = body.angle;
```

MVP에서는 이미지 에셋을 사용하지 않고 도형으로만 구현한다.

렌더링 기준:

```txt
Player  = 원 또는 사각형
Pipe    = 초록색 사각형
Ground  = 하단 사각형
Ceiling = 보이지 않는 충돌 영역 또는 얇은 사각형
Score   = Pixi Text
Button  = Pixi Graphics + Pixi Text
```

---

## 9. 주요 오브젝트 설계

### 9.1 Player

파일 위치:

```txt
src/game/objects/Player.ts
```

역할:

* Player Matter Body 생성
* Player Pixi Graphics 생성
* 점프 처리
* Body와 Graphics 위치 동기화
* 제거 처리

필수 메서드:

```ts
class Player {
  jump(): void;
  update(): void;
  destroy(): void;
}
```

---

### 9.2 Pipe

파일 위치:

```txt
src/game/objects/Pipe.ts
```

역할:

* 위쪽/아래쪽 파이프 Body 생성
* 위쪽/아래쪽 파이프 Graphics 생성
* 왼쪽 이동 처리
* 점수 획득 여부 관리
* 화면 밖 제거 여부 판단

필수 속성:

```ts
scored: boolean;
```

필수 메서드:

```ts
class Pipe {
  update(): void;
  isOffScreen(): boolean;
  destroy(): void;
}
```

---

### 9.3 Ground

파일 위치:

```txt
src/game/objects/Ground.ts
```

역할:

* 바닥 Body 생성
* 바닥 Graphics 생성

---

### 9.4 Ceiling

파일 위치:

```txt
src/game/objects/Ceiling.ts
```

역할:

* 천장 Body 생성
* 천장 충돌 영역 생성

---

## 10. Scene 설계

### 10.1 ReadyScene

역할:

* 게임 제목 표시
* 조작 설명 표시
* 시작 버튼 표시

이벤트:

* 시작 버튼 클릭 시 `onStart` 호출

---

### 10.2 PlayingScene

역할:

* 점수 표시
* Player 표시
* Pipe 표시
* Ground 표시

주의:

* 실제 물리 업데이트와 충돌 판정은 `FlappyBirdGame`에서 관리한다.
* Scene은 화면 구성과 표시 역할을 중심으로 한다.

---

### 10.3 GameOverScene

역할:

* Game Over 문구 표시
* 최종 점수 표시
* 다시 시작 버튼 표시

이벤트:

* 다시 시작 버튼 클릭 시 `onRestart` 호출

---

## 11. 입력 처리

입력 방식:

* 마우스 클릭
* 터치
* 스페이스바

입력 이벤트는 게임 시작 시 등록하고, destroy 시 제거한다.

입력 처리 규칙:

```txt
ready 상태
- 입력 시 게임 시작

playing 상태
- 입력 시 player.jump()

gameOver 상태
- 입력 무시
- 다시 시작은 버튼으로 처리
```

---

## 12. 게임 루프

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

예시 흐름:

```ts
app.ticker.add((ticker) => {
  if (this.status !== 'playing') return;

  Engine.update(this.engine, ticker.deltaMS);

  this.updatePipes();
  this.updateScore();
  this.syncRenderObjects();
});
```

---

## 13. Pipe 생성 규칙

* 일정 시간마다 Pipe 한 쌍을 생성한다.
* Pipe는 화면 오른쪽 바깥에서 생성된다.
* gap 위치는 랜덤으로 정한다.
* gap 높이는 MVP에서는 고정값을 사용한다.

예시:

```txt
pipeX = canvasWidth + pipeWidth
gapY = random value between 180 and 420
gapHeight = 180
```

---

## 14. 점수 계산

점수는 Pipe 한 쌍을 통과했을 때 1점 증가한다.

조건:

```txt
pipe.x + pipe.width / 2 < player.x
그리고
pipe.scored === false
```

처리:

```txt
score += 1
pipe.scored = true
scoreText 업데이트
```

---

## 15. 충돌 처리

Matter.js의 collisionStart 이벤트를 사용한다.

```ts
Events.on(engine, 'collisionStart', (event) => {
  for (const pair of event.pairs) {
    const labels = [pair.bodyA.label, pair.bodyB.label];

    if (labels.includes('player')) {
      this.gameOver();
    }
  }
});
```

MVP에서는 Player가 어떤 Body와 충돌해도 게임 오버로 처리한다.

충돌 대상:

```txt
player + pipe    → gameOver
player + ground  → gameOver
player + ceiling → gameOver
```

---

## 16. 재시작 처리

다시 시작 시 아래 작업을 수행한다.

```txt
1. 기존 Pipe 제거
2. 기존 Player 제거
3. Matter World 초기화
4. 점수 0으로 초기화
5. Player 새로 생성
6. Ground / Ceiling 새로 생성
7. 상태를 playing으로 변경
```

MVP에서는 다시 시작 버튼 클릭 시 바로 게임을 재시작한다.

---

## 17. 정리 규칙

`destroy()`에서는 아래 작업을 수행한다.

```txt
1. Pixi ticker 제거
2. 입력 이벤트 제거
3. Matter 이벤트 제거
4. Matter World Body 제거
5. Pixi stage children 제거
6. Pixi Application destroy
```

주의:

* 이벤트 리스너는 중복 등록되지 않게 한다.
* 게임 재시작 시 이전 Body와 Graphics가 남지 않아야 한다.
* destroy는 여러 번 호출되어도 치명적인 에러가 나지 않게 작성한다.

---

## 18. MVP 테스트 체크리스트

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
