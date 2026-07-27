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
      .then(() => {
        contactForm.reset();
        formStatus.textContent = '문의가 접수되었습니다. 빠르게 답변드리겠습니다.';
      })
      .catch(() => {
        formStatus.textContent = '전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
      });
  });
}
