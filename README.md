# 모바일 청첩장 템플릿

React + Vite 기반의 모바일 청첩장 템플릿입니다.

## 시작하기

```bash
npm install
npm run dev
```

빌드:

```bash
npm run build
```

## 어디를 수정하면 되나요?

주요 수정 파일:

- `src/App.tsx`
- `src/styles.css`
- `index.html`

## 이미지 경로

기본값은 로컬 `public/images` 입니다.

`.env` 파일을 만들고 아래처럼 바꾸면 외부 이미지 도메인도 사용할 수 있습니다.

```bash
VITE_IMAGE_BASE_URL=/images
```

예시:

```bash
VITE_IMAGE_BASE_URL=https://your-image-domain.com
```

## 교체해야 하는 이미지 파일명

`public/images` 안에 아래 이름으로 파일을 넣으면 됩니다.

### 1페이지

- `page1-cover-photo.jpg`
- `page1-title-graphic.svg`
- `page1-scribble-right.svg`
- `page1-scribble-left.svg`

### 2페이지

- `page2-main-photo.jpg`
- `page2-detail-photo.jpg`
- `page2-flower-left.png`
- `page2-name-tag.png`
- `page2-flower-right.png`

### 3페이지

- `page3-main-photo.jpg`
- `page3-portrait-photo.jpg`
- `page3-name-tag.png`
- `page3-flower-top.png`
- `page3-flower-bottom.png`

### 4페이지

- `page4-polaroid-photo.png`
- `page4-postcard-photo.png`
- `page4-flower.png`
- `page4-sticker.png`

### 5페이지

- `page5-heart.png`

갤러리:

- `public/images/gallery/gallery-01.jpg`
- `...`
- `public/images/gallery/gallery-21.jpg`

### 6페이지

- `page6-groom-icon.png`
- `page6-bride-icon.png`

## 현재 기본 포함된 자산

아래 자산은 템플릿에 실제 파일이 포함되어 있습니다.

- 페이지 장식용 꽃 이미지
- 1페이지 타이틀 그래픽
- 1페이지 스크리블 장식
- 5페이지 하트 장식

개인 사진, 이름표, 계좌 정보, 날짜, 이름 등은 직접 교체해서 사용하면 됩니다.

## 수정 포인트

- 신랑/신부 이름
- 날짜
- 소개 문구
- 부모님 성함
- 계좌 정보
- 메타데이터 제목/설명
- 공유 문구

## 참고

- 축의금/계좌 페이지는 `SHOW_GIFT_PAGE = false` 상태라 기본 숨김입니다.
- 갤러리 모달, 스와이프, 이미지 저장 방지용 보호막 로직이 포함되어 있습니다.
- 공개 전에 `index.html`의 canonical, OG 이미지, title, description을 꼭 바꿔주세요.
