# DinoJump
 
크롬 브라우저에서 인터넷 연결에 실패했을 때 나타나는 공룡 게임이다.
기존 클라이언트와 간단한 서버 연결 강의를 토대로 서버 기능과 일부 클라이언트 기능을 추가했다.

## 주요 기능

- 스테이지별 점수 획득
- 스테이지 변경시 점수 검증
- 스테이지별 다른 아이템 스폰
- 아이템 별 점수 획득
- 최종 점수 검증
- 유저별 아이디 부여
- 점수 랭킹 기능
- 최고 점수 브로드캐스트
- 1등 유저 접속 시 알림 보내기

## 프로젝트 파일 구조
📦DinoJump
 ┣ 📂assets // 게임 데이터
 ┃ ┣ 📜item.json
 ┃ ┣ 📜item_unlock.json
 ┃ ┗ 📜stage.json
 ┣ 📂public // 클라이언트
 ┃ ┣ 📂images // 이미지
 ┃ ┣ 📜CactiController.js
 ┃ ┣ 📜Cactus.js
 ┃ ┣ 📜Constants.js // 데이터 테이블 버전
 ┃ ┣ 📜Data.js
 ┃ ┣ 📜Ground.js
 ┃ ┣ 📜index.html
 ┃ ┣ 📜index.js
 ┃ ┣ 📜Item.js
 ┃ ┣ 📜ItemController.js
 ┃ ┣ 📜Player.js
 ┃ ┣ 📜Score.js
 ┃ ┣ 📜Socket.js // 서버와 연결
 ┃ ┗ 📜style.css
 ┗ 📂src
   ┣ 📂handlers // 이벤트 핸들러 모음
   ┃ ┣ 📜game.handler.js
   ┃ ┣ 📜handlerMapping.js
   ┃ ┣ 📜helper.js
   ┃ ┣ 📜register.handler.js
   ┃ ┗ 📜stage.handler.js
   ┣ 📂init // 데이터, 기능 로드
   ┃ ┣ 📜assets.js
   ┃ ┗ 📜socket.js
   ┣ 📂models // 서버 저장 데이터
   ┃ ┣ 📜item.model.js
   ┃ ┣ 📜rank.model.js
   ┃ ┣ 📜stage.model.js
   ┃ ┗ 📜user.model.js
   ┣ 📜app.js // 서버 시작
   ┗ 📜constants.js // 서버 데이터 테이블 버전
