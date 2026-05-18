# Travel Blog

React와 Vite로 만든 여행 일정 관리/공유용 블로그 프로젝트입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## 배포

`vite.config.js`의 `base` 값은 GitHub 저장소 이름과 같아야 합니다.
현재 저장소 이름을 `travel-blog`로 만들 예정이라면 그대로 두면 됩니다.

```bash
npm run deploy
```

GitHub 저장소 설정의 Pages 메뉴에서 `gh-pages` 브랜치를 배포 대상으로 선택하세요.
