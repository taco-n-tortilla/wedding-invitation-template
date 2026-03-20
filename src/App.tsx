import { useEffect, useRef, useState, type CSSProperties, type SyntheticEvent } from 'react';

type AssetSpec = {
  alt: string;
  filename: string;
  label: string;
  src?: string;
};

type Account = {
  bank: string;
  holder: string;
  number: string;
};

const DESIGN_WIDTH = 402;
const PAGE_HEIGHT = 874;
const IMAGE_BASE_URL = (import.meta.env.VITE_IMAGE_BASE_URL ?? '/images').replace(/\/$/, '');
const SHOW_GIFT_PAGE = false;

const ASSETS = {
  page1Background: {
    alt: '1페이지 배경 이미지',
    filename: 'page1-cover-photo.jpg',
    label: '1페이지 메인 사진',
  },
  page1Title: {
    alt: '1페이지 타이포 그래픽',
    filename: 'page1-title-graphic.svg',
    label: '1페이지 타이포',
  },
  page1VectorRight: {
    alt: '1페이지 오른쪽 벡터 장식',
    filename: 'page1-scribble-right.svg',
    label: '1페이지 오른쪽 장식',
  },
  page1VectorLeft: {
    alt: '1페이지 왼쪽 벡터 장식',
    filename: 'page1-scribble-left.svg',
    label: '1페이지 왼쪽 장식',
  },
  page2Main: {
    alt: '2페이지 메인 이미지',
    filename: 'page2-main-photo.jpg',
    label: '2페이지 메인 사진',
  },
  page2Child: {
    alt: '2페이지 서브 이미지',
    filename: 'page2-detail-photo.jpg',
    label: '2페이지 서브 사진',
  },
  page2FlowerLeft: {
    alt: '2페이지 왼쪽 꽃 일러스트',
    filename: 'page2-flower-left.png',
    label: '꽃 일러스트 1',
  },
  page2NameTag: {
    alt: '2페이지 신랑 이름표',
    filename: 'page2-name-tag.png',
    label: '2페이지 이름표',
  },
  page2FlowerRight: {
    alt: '2페이지 오른쪽 꽃 일러스트',
    filename: 'page2-flower-right.png',
    label: '꽃 일러스트2 1',
  },
  page3Main: {
    alt: '3페이지 메인 이미지',
    filename: 'page3-main-photo.jpg',
    label: '3페이지 메인 사진',
  },
  page3Portrait: {
    alt: '3페이지 세로 이미지',
    filename: 'page3-portrait-photo.jpg',
    label: '3페이지 세로 사진',
  },
  page3NameTag: {
    alt: '3페이지 신부 이름표',
    filename: 'page3-name-tag.png',
    label: '3페이지 이름표',
  },
  page3FlowerTop: {
    alt: '3페이지 오른쪽 꽃 일러스트',
    filename: 'page3-flower-top.png',
    label: '꽃 일러스트3 1',
  },
  page3FlowerBottom: {
    alt: '3페이지 왼쪽 꽃 일러스트',
    filename: 'page3-flower-bottom.png',
    label: '꽃 일러스트4 1',
  },
  page4Polaroid: {
    alt: '4페이지 폴라로이드 이미지',
    filename: 'page4-polaroid-photo.png',
    label: '4페이지 폴라로이드 사진',
  },
  page4Postcard: {
    alt: '4페이지 포토카드 이미지',
    filename: 'page4-postcard-photo.png',
    label: '포토카드 1',
  },
  page4Flower: {
    alt: '4페이지 꽃 장식',
    filename: 'page4-flower.png',
    label: '꽃 일러스트5 1',
  },
  page4Sticker: {
    alt: '4페이지 장식 이미지',
    filename: 'page4-sticker.png',
    label: 'ChatGPT Image 장식 1',
  },
  page5Heart: {
    alt: '5페이지 하트 이미지',
    filename: 'page5-heart.png',
    label: '하트타코영2 1',
  },
  page6GroomIcon: {
    alt: '신랑 측 아이콘',
    filename: 'page6-groom-icon.png',
    label: 'image 3',
  },
  page6BrideIcon: {
    alt: '신부 측 아이콘',
    filename: 'page6-bride-icon.png',
    label: 'image 2',
  },
} satisfies Record<string, AssetSpec>;

const PAGE5_GALLERY_PATHS = [
  'gallery/gallery-01.jpg',
  'gallery/gallery-02.jpg',
  'gallery/gallery-03.jpg',
  'gallery/gallery-04.jpg',
  'gallery/gallery-05.jpg',
  'gallery/gallery-06.jpg',
  'gallery/gallery-07.jpg',
  'gallery/gallery-08.jpg',
  'gallery/gallery-09.jpg',
  'gallery/gallery-10.jpg',
  'gallery/gallery-11.jpg',
  'gallery/gallery-12.jpg',
  'gallery/gallery-13.jpg',
  'gallery/gallery-14.jpg',
  'gallery/gallery-15.jpg',
  'gallery/gallery-16.jpg',
  'gallery/gallery-17.jpg',
  'gallery/gallery-18.jpg',
  'gallery/gallery-19.jpg',
  'gallery/gallery-20.jpg',
  'gallery/gallery-21.jpg',
];

const GALLERY_ASSETS: AssetSpec[] = PAGE5_GALLERY_PATHS
  .sort((leftPath, rightPath) =>
    leftPath.localeCompare(rightPath, undefined, { numeric: true, sensitivity: 'base' }),
  )
  .map((path, index) => {
    const filename = path.split('/').pop() ?? `page5-gallery-${index + 1}`;

    return {
      alt: `5페이지 갤러리 이미지 ${index + 1}`,
      filename: `gallery/${filename}`,
      label: `갤러리 ${index + 1}`,
    };
  });

const MAX_PAGE5_THUMBNAILS = 9;

const PAGE5_PREVIEW_ITEMS = Array.from({ length: MAX_PAGE5_THUMBNAILS }, (_, index) => ({
  asset: GALLERY_ASSETS[index] ?? null,
  key: GALLERY_ASSETS[index]?.filename ?? `page5-gallery-slot-${index + 1}`,
  modalIndex: GALLERY_ASSETS[index] ? index : null,
  slotNumber: index + 1,
}));

const PAGE5_GALLERY_ROWS = Array.from(
  { length: Math.ceil(PAGE5_PREVIEW_ITEMS.length / 3) },
  (_, index) => PAGE5_PREVIEW_ITEMS.slice(index * 3, index * 3 + 3),
);

const GROOM_ACCOUNTS: Account[] = [
  { bank: '은행명', number: '000-0000-0000', holder: '신랑 이름' },
  { bank: '은행명', number: '000-0000-0000', holder: '신랑 아버지' },
  { bank: '은행명', number: '000-0000-0000', holder: '신랑 어머니' },
];

const BRIDE_ACCOUNTS: Account[] = [
  { bank: '은행명', number: '000-0000-0000', holder: '신부 이름' },
  { bank: '은행명', number: '000-0000-0000', holder: '신부 아버지' },
  { bank: '은행명', number: '000-0000-0000', holder: '신부 어머니' },
];

function getScale() {
  if (typeof window === 'undefined') {
    return 1;
  }

  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;

  return Math.min(viewportWidth / DESIGN_WIDTH, 1);
}

function abs(left: number, top: number, width: number, height: number): CSSProperties {
  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
  };
}

function getAssetSource(asset: AssetSpec) {
  return asset.src ?? `${IMAGE_BASE_URL}/${asset.filename.replace(/^\/+/, '')}`;
}

function blockImageInteraction(event: SyntheticEvent) {
  event.preventDefault();
}

function AssetLayer({
  asset,
  className,
  style,
}: {
  asset: AssetSpec;
  className?: string;
  style: CSSProperties;
}) {
  const [isMissing, setIsMissing] = useState(false);
  const shouldReveal = className?.includes('reveal-') ?? false;

  return (
    <div
      className={`asset-layer${className ? ` ${className}` : ''}`}
      style={style}
      data-reveal={shouldReveal ? 'true' : undefined}
      onContextMenu={blockImageInteraction}
      onCopy={blockImageInteraction}
    >
      {!isMissing && (
        <>
          <img
            src={getAssetSource(asset)}
            alt={asset.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
            onContextMenu={blockImageInteraction}
            onCopy={blockImageInteraction}
            onDragStart={blockImageInteraction}
            onError={() => setIsMissing(true)}
          />
          <div className="asset-layer__shield" aria-hidden="true" onContextMenu={blockImageInteraction} onCopy={blockImageInteraction} />
        </>
      )}

      {isMissing && (
        <div className="asset-layer__placeholder" role="img" aria-label={asset.label}>
          <span>{asset.filename}</span>
          <small>{asset.label}</small>
        </div>
      )}
    </div>
  );
}

function CenterLines({
  className,
  lines,
  style,
}: {
  className?: string;
  lines: string[];
  style: CSSProperties;
}) {
  return (
    <div className={`center-lines${className ? ` ${className}` : ''}`} style={style}>
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

function GalleryTile({
  asset,
  index,
  onOpen,
}: {
  asset: AssetSpec | null;
  index: number | null;
  onOpen: (index: number) => void;
}) {
  const [isMissing, setIsMissing] = useState(false);
  const isInteractive = asset !== null && index !== null;

  return (
    <button
      type="button"
      className="page5-gallery-tile"
      onClick={() => {
        if (index !== null) {
          onOpen(index);
        }
      }}
      aria-label={asset ? `${asset.alt} 크게 보기` : '빈 갤러리 슬롯'}
      disabled={!isInteractive}
      onContextMenu={blockImageInteraction}
      onCopy={blockImageInteraction}
    >
      <div className="page5-gallery-crop">
        {asset && !isMissing ? (
          <>
            <img
              src={getAssetSource(asset)}
              alt={asset.alt}
              loading="lazy"
              decoding="async"
              draggable={false}
              onContextMenu={blockImageInteraction}
              onCopy={blockImageInteraction}
              onDragStart={blockImageInteraction}
              onError={() => setIsMissing(true)}
            />
            <div className="page5-gallery-shield" aria-hidden="true" onContextMenu={blockImageInteraction} onCopy={blockImageInteraction} />
          </>
        ) : (
          <div
            className="page5-gallery-placeholder"
            role="img"
            aria-label={asset ? asset.label : '빈 갤러리 슬롯'}
          >
            <span>{asset ? asset.filename : 'page5-gallery-*'}</span>
            <small>{asset ? asset.label : '최대 12컷 썸네일'}</small>
          </div>
        )}
      </div>
    </button>
  );
}

function GalleryModalImage({ asset }: { asset: AssetSpec }) {
  const [isMissing, setIsMissing] = useState(false);

  return (
    <div className="gallery-modal__media" onContextMenu={blockImageInteraction} onCopy={blockImageInteraction}>
      {!isMissing && (
        <>
          <img
            src={getAssetSource(asset)}
            alt={asset.alt}
            decoding="async"
            draggable={false}
            onContextMenu={blockImageInteraction}
            onCopy={blockImageInteraction}
            onDragStart={blockImageInteraction}
            onError={() => setIsMissing(true)}
          />
          <div className="gallery-modal__shield" aria-hidden="true" onContextMenu={blockImageInteraction} onCopy={blockImageInteraction} />
        </>
      )}

      {isMissing && (
        <div className="gallery-modal__placeholder" role="img" aria-label={asset.label}>
          <span>{asset.filename}</span>
          <small>{asset.label}</small>
        </div>
      )}
    </div>
  );
}

function FigmaPage({
  children,
  className,
  index,
}: {
  children: React.ReactNode;
  className?: string;
  index: number;
}) {
  return (
    <section
      className={`figma-page${className ? ` ${className}` : ''}`}
      data-page-index={index}
    >
      <div className="figma-page__scale-box">
        <div className="figma-page__stage">{children}</div>
      </div>
    </section>
  );
}

function AccountSection({
  accounts,
  icon,
  onCopy,
  side,
  style,
}: {
  accounts: Account[];
  icon: AssetSpec;
  onCopy: (value: string, label: string) => void;
  side: string;
  style: CSSProperties;
}) {
  const rowTops = [48, 122, 196];

  return (
    <section className="account-section" style={style} aria-label={`${side} 계좌`}>
      <div className="account-side" style={abs(24, 0, 84, 32)}>
        <AssetLayer asset={icon} style={abs(0, 1, 30, 30)} />
        <p>{side}</p>
      </div>

      {accounts.map((account, index) => (
        <div
          key={`${side}-${account.bank}-${account.holder}`}
          className="account-row"
          style={abs(0, rowTops[index], 402, 58)}
        >
          <div className="account-copy" style={abs(30, 0, 180, 58)}>
            <p>{`${account.bank} ${account.number}`}</p>
            <span>{account.holder}</span>
          </div>

          <button
            type="button"
            className="copy-button"
            style={abs(242, 6, 140, 46)}
            onClick={() =>
              onCopy(
                `${account.bank} ${account.number} ${account.holder}`,
                `${account.holder} 계좌를 복사했어요.`,
              )
            }
          >
            복사하기
          </button>
        </div>
      ))}
    </section>
  );
}

export default function App() {
  const galleryNavTimeoutRef = useRef<number | null>(null);
  const gallerySwipeStateRef = useRef<{
    pointerId: number | null;
    startX: number;
    startY: number;
    deltaX: number;
    deltaY: number;
    isTouchLike: boolean;
  }>({
    pointerId: null,
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    isTouchLike: false,
  });
  const [scale, setScale] = useState(getScale);
  const [toastMessage, setToastMessage] = useState('');
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const [isGalleryNavVisible, setIsGalleryNavVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const nextScale = getScale();
      setScale((currentScale) => (Math.abs(currentScale - nextScale) < 0.001 ? currentScale : nextScale));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (revealTargets.length === 0) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      revealTargets.forEach((target) => target.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.22,
        rootMargin: '0px 0px -8% 0px',
      },
    );

    revealTargets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(''), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const isGalleryOpen = activeGalleryIndex !== null;

  useEffect(() => {
    if (!isGalleryOpen) {
      return;
    }

    const body = document.body;
    const html = document.documentElement;
    const scrollY = window.scrollY;
    const previousStyles = {
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyTouchAction: body.style.touchAction,
      bodyOverscrollBehavior: body.style.overscrollBehavior,
      bodyScrollSnapType: body.style.scrollSnapType,
      bodyScrollBehavior: body.style.scrollBehavior,
      htmlOverflow: html.style.overflow,
      htmlOverscrollBehavior: html.style.overscrollBehavior,
      htmlScrollSnapType: html.style.scrollSnapType,
      htmlScrollBehavior: html.style.scrollBehavior,
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveGalleryIndex(null);
        return;
      }

      if (event.key === 'ArrowRight') {
        setActiveGalleryIndex((current) =>
          current === null ? current : (current + 1) % GALLERY_ASSETS.length,
        );
      }

      if (event.key === 'ArrowLeft') {
        setActiveGalleryIndex((current) =>
          current === null ? current : (current - 1 + GALLERY_ASSETS.length) % GALLERY_ASSETS.length,
        );
      }
    };

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.touchAction = 'none';
    body.style.overscrollBehavior = 'none';
    body.style.scrollSnapType = 'none';
    body.style.scrollBehavior = 'auto';
    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    html.style.scrollSnapType = 'none';
    html.style.scrollBehavior = 'auto';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      body.style.overflow = previousStyles.bodyOverflow;
      body.style.position = previousStyles.bodyPosition;
      body.style.top = previousStyles.bodyTop;
      body.style.left = previousStyles.bodyLeft;
      body.style.right = previousStyles.bodyRight;
      body.style.width = previousStyles.bodyWidth;
      body.style.touchAction = previousStyles.bodyTouchAction;
      body.style.overscrollBehavior = previousStyles.bodyOverscrollBehavior;
      body.style.scrollSnapType = 'none';
      body.style.scrollBehavior = 'auto';
      html.style.overflow = previousStyles.htmlOverflow;
      html.style.overscrollBehavior = previousStyles.htmlOverscrollBehavior;
      html.style.scrollSnapType = 'none';
      html.style.scrollBehavior = 'auto';
      window.scrollTo({ top: scrollY, left: 0, behavior: 'auto' });

      window.requestAnimationFrame(() => {
        body.style.scrollSnapType = previousStyles.bodyScrollSnapType;
        body.style.scrollBehavior = previousStyles.bodyScrollBehavior;
        html.style.scrollSnapType = previousStyles.htmlScrollSnapType;
        html.style.scrollBehavior = previousStyles.htmlScrollBehavior;
      });

      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGalleryOpen]);

  useEffect(() => {
    if (galleryNavTimeoutRef.current !== null) {
      window.clearTimeout(galleryNavTimeoutRef.current);
      galleryNavTimeoutRef.current = null;
    }

    if (activeGalleryIndex === null) {
      setIsGalleryNavVisible(false);
      return;
    }

    setIsGalleryNavVisible(false);

    return () => {
      if (galleryNavTimeoutRef.current !== null) {
        window.clearTimeout(galleryNavTimeoutRef.current);
        galleryNavTimeoutRef.current = null;
      }
    };
  }, [activeGalleryIndex]);

  const copyText = async (value: string, message: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setToastMessage(message);
    } catch {
      setToastMessage('복사 권한을 확인해 주세요.');
    }
  };

  const shareInvitation = async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'OO ❤️ OO 결혼합니다!',
          text: '저희 두 사람의 새로운 시작을 축하해주세요.',
          url: shareUrl,
        });
        setToastMessage('공유 창을 열었어요.');
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    await copyText(shareUrl, '청첩장 주소를 복사했어요.');
  };

  const openGallery = (index: number) => {
    setActiveGalleryIndex(index);
  };

  const closeGallery = () => {
    setActiveGalleryIndex(null);
  };

  const showPrevGalleryImage = () => {
    setActiveGalleryIndex((current) =>
      current === null ? current : (current - 1 + GALLERY_ASSETS.length) % GALLERY_ASSETS.length,
    );
  };

  const showNextGalleryImage = () => {
    setActiveGalleryIndex((current) =>
      current === null ? current : (current + 1) % GALLERY_ASSETS.length,
    );
  };

  const revealGalleryNav = () => {
    const isTouchLike = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
    if (!isTouchLike || activeGalleryIndex === null) {
      return;
    }

    setIsGalleryNavVisible(true);

    if (galleryNavTimeoutRef.current !== null) {
      window.clearTimeout(galleryNavTimeoutRef.current);
    }

    galleryNavTimeoutRef.current = window.setTimeout(() => {
      setIsGalleryNavVisible(false);
      galleryNavTimeoutRef.current = null;
    }, 1600);
  };

  const resetGallerySwipe = () => {
    gallerySwipeStateRef.current = {
      pointerId: null,
      startX: 0,
      startY: 0,
      deltaX: 0,
      deltaY: 0,
      isTouchLike: false,
    };
  };

  const handleGalleryPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    gallerySwipeStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      deltaX: 0,
      deltaY: 0,
      isTouchLike: event.pointerType !== 'mouse',
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleGalleryPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const swipeState = gallerySwipeStateRef.current;
    if (swipeState.pointerId !== event.pointerId) {
      return;
    }

    swipeState.deltaX = event.clientX - swipeState.startX;
    swipeState.deltaY = event.clientY - swipeState.startY;
  };

  const handleGalleryPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const swipeState = gallerySwipeStateRef.current;
    if (swipeState.pointerId !== event.pointerId) {
      return;
    }

    const absDeltaX = Math.abs(swipeState.deltaX);
    const absDeltaY = Math.abs(swipeState.deltaY);
    const isHorizontalSwipe = absDeltaX > 48 && absDeltaX > absDeltaY;
    const isSwipeDownToClose =
      swipeState.isTouchLike &&
      swipeState.deltaY > 84 &&
      absDeltaY > absDeltaX &&
      activeGalleryIndex !== null;

    if (isSwipeDownToClose) {
      closeGallery();
      setIsGalleryNavVisible(false);
    } else if (isHorizontalSwipe) {
      if (swipeState.deltaX < 0) {
        showNextGalleryImage();
      } else {
        showPrevGalleryImage();
      }
      setIsGalleryNavVisible(false);
    } else if (swipeState.isTouchLike) {
      revealGalleryNav();
    }

    resetGallerySwipe();
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const activeGalleryAsset = activeGalleryIndex === null ? null : GALLERY_ASSETS[activeGalleryIndex];

  return (
    <>
      <main className="canvas-shell" style={{ '--page-scale': scale } as CSSProperties}>
        <FigmaPage
          index={0}
          className="page page--1"
        >
            <AssetLayer
              asset={ASSETS.page1Background}
              style={abs(-17, 0, 435, 679)}
              className="page1-background"
            />
            <div className="page1-top-mask" style={abs(0, 0, 402, 290)} />
            <AssetLayer asset={ASSETS.page1Title} style={abs(37, 31, 328, 291)} />

            <AssetLayer asset={ASSETS.page1VectorRight} style={abs(290.07, 397.07, 23.73, 22.51)} />
            <AssetLayer asset={ASSETS.page1VectorLeft} style={abs(62.54, 418.56, 24.28, 15.61)} />

            <p className="page1-name page1-name--left" style={abs(36, 392, 30, 31)}>
              OO
            </p>
            <p className="page1-name page1-name--right" style={abs(323, 385, 35, 31)}>
              OO
            </p>

            <div className="page1-footer" style={abs(0, 575, 402, 108)}>
              <p className="page1-footer__headline">We&apos;re getting Married!</p>
              <p className="page1-footer__subline">Groom Name &amp; Bride Name</p>
              <p className="page1-footer__subline">YYYY/MM/DD</p>
            </div>
        </FigmaPage>

        <FigmaPage
          index={1}
          className="page page--2"
        >
            <div className="page2-lead-frame" style={abs(0, 47, 402, 90.5)}>
              <p className="page2-copy-line">저희, 두 사람</p>
              <p className="page2-copy-line">서로를 평생의 동반자로 약속하며</p>
              <p className="page2-copy-line">새로운 시작을 하게 되었습니다.</p>
            </div>

            <AssetLayer
              asset={ASSETS.page2Main}
              style={abs(61, 170, 280, 280)}
              className="page2-main-photo reveal-fade-up reveal-delay-1"
            />
            <div className="page2-main-mask reveal-fade-up reveal-delay-1" style={abs(61, 170, 280, 169.35)} data-reveal />
            <p className="page2-main-caption reveal-fade-up reveal-delay-2" style={abs(77, 186, 154, 51)} data-reveal>
              <span className="page2-main-caption-primary">아버지 성함 &amp; 어머니 성함의</span>
              <span className="page2-main-caption-secondary">아들 신랑 이름</span>
            </p>
            <AssetLayer asset={ASSETS.page2Child} style={abs(231, 332, 157, 245)} className="reveal-fade-up reveal-delay-3" />
            <AssetLayer asset={ASSETS.page2FlowerLeft} style={abs(27, 422, 99, 103)} className="reveal-fade-up reveal-delay-4" />
            <AssetLayer asset={ASSETS.page2NameTag} style={abs(187, 523, 107, 36)} className="reveal-fade-up reveal-delay-5" />
            <AssetLayer asset={ASSETS.page2FlowerRight} style={abs(317, 582, 56, 55)} className="reveal-fade-up reveal-delay-6" />

            <p className="page2-quote-text" style={abs(0, 606, 402, 176)}>
              <span className="page2-quote-line">부부란 무더운 여름밤</span>
              <span className="page2-quote-line">멀찍이 잠을 청하다가</span>
              <span className="page2-quote-line">어둠 속에서 앵하고 모기 소리가 들리면</span>
              <span className="page2-quote-line">순식간에 둘이 합세하여</span>
              <span className="page2-quote-line">모기를 잡는 사이이다.</span>
              <span className="page2-quote-credit">&lt;부부&gt;, 문정희</span>
            </p>
        </FigmaPage>

        <FigmaPage
          index={2}
          className="page page--3"
        >
            <AssetLayer
              asset={ASSETS.page3Main}
              style={abs(61, 55, 280, 280)}
              className="page3-main-photo reveal-fade-up reveal-delay-1"
            />
            <div className="page3-main-mask reveal-fade-up reveal-delay-1" style={abs(61, 55, 280, 163)} data-reveal />
            <p className="page3-main-caption reveal-fade-up reveal-delay-2" style={abs(77, 71, 155, 51)} data-reveal>
              <span className="page3-main-caption-primary">아버지 성함 &amp; 어머니 성함의</span>
              <span className="page3-main-caption-secondary">딸 신부 이름</span>
            </p>
            <AssetLayer asset={ASSETS.page3Portrait} style={abs(196, 219, 160, 289)} className="reveal-fade-up reveal-delay-3" />
            <AssetLayer asset={ASSETS.page3NameTag} style={abs(143, 390, 107, 36)} className="reveal-fade-up reveal-delay-4" />
            <AssetLayer asset={ASSETS.page3FlowerTop} style={abs(336, 370, 48, 75)} className="reveal-fade-up reveal-delay-5" />
            <AssetLayer asset={ASSETS.page3FlowerBottom} style={abs(61, 480, 49, 84)} className="reveal-fade-up reveal-delay-6" />

            <div className="page3-text-frame" style={abs(0, 558, 402, 176)}>
              <div className="page3-text-block page3-text-block--top">
                <div className="page3-text-inner page3-text-inner--top">
                  <p className="page3-copy-line page3-copy-line--standard">매일의 작은 소란을</p>
                  <p className="page3-copy-line page3-copy-line--standard">유쾌히 함께할 수 있는</p>
                  <p className="page3-copy-line page3-copy-line--standard">평생의 짝꿍을 만났습니다.</p>
                </div>
              </div>
              <div className="page3-text-block page3-text-block--bottom">
                <div className="page3-text-inner page3-text-inner--bottom">
                  <p className="page3-copy-line page3-copy-line--standard">서로의 가장 친한 친구이자</p>
                  <p className="page3-copy-line page3-copy-line--compact">인생의 동반자가 되려 합니다.</p>
                </div>
              </div>
            </div>
        </FigmaPage>

        <FigmaPage
          index={3}
          className="page page--4"
        >
            <AssetLayer
              asset={ASSETS.page4Polaroid}
              style={abs(26, 8, 309.5, 393.01)}
              className="page4-polaroid reveal-settle-left reveal-delay-1"
            />
            <AssetLayer
              asset={ASSETS.page4Postcard}
              style={abs(65.78, 254, 308.96, 392.34)}
              className="page4-postcard reveal-settle-right reveal-delay-3"
            />
            <AssetLayer asset={ASSETS.page4Flower} style={abs(312, 133, 57, 59)} className="page4-flower reveal-fade-up reveal-delay-2" />
            <AssetLayer asset={ASSETS.page4Sticker} style={abs(5, 509, 151.84, 151.84)} className="page4-sticker reveal-fade-up reveal-delay-4" />

            <div className="page4-text-frame" style={abs(0, 659, 402, 87.5)}>
              <div className="page4-text-inner">
                <p className="page4-copy-line page4-copy-line--tall">저희의 새로운 시작을</p>
                <p className="page4-copy-line page4-copy-line--compact">따뜻한 마음으로</p>
                <p className="page4-copy-line page4-copy-line--compact">축복해주세요</p>
              </div>
            </div>
        </FigmaPage>

        <FigmaPage
          index={4}
          className="page page--5"
        >
            <div className="page5-frame" style={abs(0, 0, 402, 722)}>
              <div className="page5-gallery-stack">
                <div className="page5-title-row">
                  <p className="page5-title">Our Moments, Our Forever</p>
                </div>

                {PAGE5_GALLERY_ROWS.map((row, rowIndex) => (
                  <div key={`page5-row-${rowIndex}`} className="page5-gallery-row">
                    {row.map((item) => {
                      return (
                        <GalleryTile
                          key={item.key}
                          asset={item.asset}
                          index={item.modalIndex}
                          onOpen={openGallery}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="page5-heart-section">
                <AssetLayer
                  asset={ASSETS.page5Heart}
                  className="page5-heart-asset"
                  style={{ position: 'relative', width: '134px', height: '120px' }}
                />

                <div className="page5-copy-stack">
                  <div className="page5-copy-inner">
                    <p className="page5-copy">예쁘고 행복하게 잘 살겠습니다.</p>
                  </div>
                </div>
              </div>
            </div>
        </FigmaPage>

        {SHOW_GIFT_PAGE ? (
          <FigmaPage
            index={5}
            className="page page--6"
          >
              <div className="page6-pill" style={abs(145, 40, 112, 49)}>
                <span>마음 전하실 곳</span>
              </div>

              <AccountSection
                accounts={GROOM_ACCOUNTS}
                icon={ASSETS.page6GroomIcon}
                side="신랑 측"
                style={abs(0, 119, 402, 254)}
                onCopy={(value, message) => {
                  void copyText(value, message);
                }}
              />

              <div className="page6-divider" style={abs(0, 393, 402, 2)} />

              <AccountSection
                accounts={BRIDE_ACCOUNTS}
                icon={ASSETS.page6BrideIcon}
                side="신부 측"
                style={abs(0, 415, 402, 254)}
                onCopy={(value, message) => {
                  void copyText(value, message);
                }}
              />

              <button type="button" className="share-action" style={abs(36, 719, 330, 52)} onClick={shareInvitation}>
                카카오톡 공유
              </button>
              <button
                type="button"
                className="share-action"
                style={abs(36, 787, 330, 52)}
                onClick={() => {
                  void copyText(window.location.href, '청첩장 주소를 복사했어요.');
                }}
              >
                청첩장 주소 복사
              </button>
          </FigmaPage>
        ) : null}
      </main>

      <div className={`toast${toastMessage ? ' is-visible' : ''}`} role="status" aria-live="polite">
        {toastMessage}
      </div>

      {activeGalleryAsset ? (
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-label="웨딩 갤러리">
          <button
            type="button"
            className="gallery-modal__backdrop"
            aria-label="갤러리 닫기"
            onClick={closeGallery}
          />

          <div className="gallery-modal__panel">
            <div className={`gallery-modal__viewport${isGalleryNavVisible ? ' is-nav-visible' : ''}`}>
              <div className="gallery-modal__content">
                <div className="gallery-modal__header">
                  <div className="gallery-modal__counter-wrap" aria-live="polite">
                    <span className="gallery-modal__counter-current">{(activeGalleryIndex ?? 0) + 1}</span>
                    <span className="gallery-modal__counter-total">/{GALLERY_ASSETS.length}</span>
                  </div>

                  <button type="button" className="gallery-modal__close" aria-label="갤러리 닫기" onClick={closeGallery}>
                    <span className="gallery-modal__close-icon" aria-hidden="true" />
                  </button>
                </div>

                <div
                  className="gallery-modal__media-shell"
                  onPointerDown={handleGalleryPointerDown}
                  onPointerMove={handleGalleryPointerMove}
                  onPointerUp={handleGalleryPointerEnd}
                  onPointerCancel={resetGallerySwipe}
                >
                  <GalleryModalImage key={activeGalleryAsset.filename} asset={activeGalleryAsset} />
                </div>
              </div>

              <div className="gallery-modal__nav-row">
                <button
                  type="button"
                  className="gallery-modal__nav gallery-modal__nav--prev"
                  aria-label="이전 사진"
                  onClick={showPrevGalleryImage}
                >
                  <span className="gallery-modal__nav-icon gallery-modal__nav-icon--prev" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className="gallery-modal__nav gallery-modal__nav--next"
                  aria-label="다음 사진"
                  onClick={showNextGalleryImage}
                >
                  <span className="gallery-modal__nav-icon gallery-modal__nav-icon--next" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
