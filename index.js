const contactCtaBtn = document.getElementById('contact-cta-btn');

if (contactCtaBtn) {
  contactCtaBtn.addEventListener('click', function (e) {
    const destination = contactCtaBtn.getAttribute('href');
    if (typeof gtag !== 'function') return;

    e.preventDefault();
    let navigated = false;
    const goToDestination = function () {
      if (navigated) return;
      navigated = true;
      window.location.href = destination;
    };

    gtag('event', 'conversion', {
      'send_to': 'AW-16881807197/TfWDCMHMp-UcEN3e7_E-',
      'value': 1.0,
      'currency': 'KRW',
      'event_callback': goToDestination
    });
    // 전환 신호 전송이 지연되거나 실패해도 사용자가 계속 진행할 수 있도록 안전장치로 타임아웃을 둠
    setTimeout(goToDestination, 1000);
  });
}

const aboutTrack = document.getElementById('about-carousel-track');
const aboutDots = document.querySelectorAll('#about-carousel-dots .dot');

if (aboutTrack && aboutDots.length) {
  const slides = aboutTrack.querySelectorAll('.carousel-slide');

  aboutDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      slides[Number(dot.dataset.index)].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = Array.from(slides).indexOf(entry.target);
        aboutDots.forEach((dot) => dot.classList.remove('active'));
        aboutDots[index]?.classList.add('active');
      });
    },
    { root: aboutTrack, threshold: 0.6 }
  );
  slides.forEach((slide) => observer.observe(slide));
}

const switcherTabs = document.querySelectorAll('.switcher-tab');

if (switcherTabs.length) {
  const items = document.querySelectorAll('.switcher-item');
  const media = document.querySelectorAll('.switcher-media-item');

  // 현재 활성 탭이 얼마나 오래 보여졌는지 추적 (탭 전환 시 / 페이지 이탈 시 전송)
  const initialTab = document.querySelector('.switcher-tab.active');
  let activeProduct = initialTab ? initialTab.dataset.target : null;
  let activeSince = Date.now();

  const sendEngagement = () => {
    if (!activeProduct || typeof gtag !== 'function') return;
    gtag('event', 'product_tab_engagement', {
      product: activeProduct,
      engagement_time_msec: Date.now() - activeSince
    });
  };

  switcherTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      if (target === activeProduct) return;

      sendEngagement();
      if (typeof gtag === 'function') {
        gtag('event', 'select_product', { product: target });
      }

      switcherTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      items.forEach((item) => item.classList.toggle('active', item.dataset.item === target));
      media.forEach((el) => el.classList.toggle('active', el.dataset.item === target));

      activeProduct = target;
      activeSince = Date.now();
    });
  });

  // 탭을 바꾸지 않고 페이지를 떠나는 경우에도 마지막 체류 시간을 전송
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') sendEngagement();
  });
}

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(contactForm);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString()
    })
      .then((response) => {
        if (!response.ok) throw new Error('폼 제출 실패: ' + response.status);
      })
      .then(() => {
        contactForm.reset();
        formStatus.textContent = '문의가 접수되었습니다. 빠르게 답변드리겠습니다.';
        if (typeof gtag === 'function') {
          gtag('event', 'conversion', {
            'send_to': 'AW-16881807197/z0HeCJXUrOUcEN3e7_E-',
            'value': 1.0,
            'currency': 'KRW'
          });
        }
      })
      .catch(() => {
        formStatus.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
      });
  });
}
