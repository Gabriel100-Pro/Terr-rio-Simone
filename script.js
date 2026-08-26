document.addEventListener("DOMContentLoaded", () => {

  const track = document.querySelector(".products-track");
  const wrapper = document.querySelector(".products-track-wrapper");

  const prevButton = document.querySelector(".carousel-prev");
  const nextButton = document.querySelector(".carousel-next");

  const dots = document.querySelectorAll(".carousel-dot");
  const cards = document.querySelectorAll(".product-card");

  if (!track || !wrapper || !cards.length) return;


  /* =========================================
     CONFIGURAÇÕES
  ========================================= */

  let currentSlide = 0;

  let startX = 0;
  let currentX = 0;

  let isDragging = false;

  let autoPlay;


  /* =========================================
     CALCULA QUANTOS CARDS APARECEM
  ========================================= */

  function getVisibleCards() {

    const width = window.innerWidth;

    if (width <= 380) {
      return 1;
    }

    if (width <= 600) {
      return 2;
    }

    if (width <= 900) {
      return 3;
    }

    return 4;
  }


  /* =========================================
     TOTAL DE SLIDES
  ========================================= */

  function getTotalSlides() {

    const visibleCards = getVisibleCards();

    return Math.max(
      1,
      cards.length - visibleCards + 1
    );
  }


  /* =========================================
     ATUALIZA CARROSSEL
  ========================================= */

  function updateCarousel() {

    const visibleCards = getVisibleCards();

    const cardWidth = cards[0].offsetWidth;

    const gap = parseFloat(
      window.getComputedStyle(track).gap
    ) || 0;

    const offset =
      currentSlide * (cardWidth + gap);

    track.style.transform =
      `translateX(-${offset}px)`;


    /* Atualiza bolinhas */

    dots.forEach((dot, index) => {

      dot.classList.toggle(
        "active",
        index === currentSlide
      );

    });


    /* Controla limite das setas */

    prevButton.disabled =
      currentSlide === 0;

    nextButton.disabled =
      currentSlide >= getTotalSlides() - 1;


    prevButton.style.opacity =
      currentSlide === 0 ? "0.35" : "1";

    nextButton.style.opacity =
      currentSlide >= getTotalSlides() - 1
        ? "0.35"
        : "1";
  }


  /* =========================================
     PRÓXIMO SLIDE
  ========================================= */

  function nextSlide() {

    const totalSlides = getTotalSlides();

    if (currentSlide < totalSlides - 1) {

      currentSlide++;

    } else {

      currentSlide = 0;

    }

    updateCarousel();
  }


  /* =========================================
     SLIDE ANTERIOR
  ========================================= */

  function previousSlide() {

    const totalSlides = getTotalSlides();

    if (currentSlide > 0) {

      currentSlide--;

    } else {

      currentSlide = totalSlides - 1;

    }

    updateCarousel();
  }


  /* =========================================
     CLIQUE NAS SETAS
  ========================================= */

  nextButton.addEventListener(
    "click",
    () => {

      nextSlide();

      restartAutoPlay();

    }
  );


  prevButton.addEventListener(
    "click",
    () => {

      previousSlide();

      restartAutoPlay();

    }
  );


  /* =========================================
     CLIQUE NAS BOLINHAS
  ========================================= */

  dots.forEach((dot, index) => {

    dot.addEventListener(
      "click",
      () => {

        const totalSlides =
          getTotalSlides();

        currentSlide =
          Math.min(
            index,
            totalSlides - 1
          );

        updateCarousel();

        restartAutoPlay();

      }
    );

  });


  /* =========================================
     DRAG COM MOUSE
  ========================================= */

  track.addEventListener(
    "mousedown",
    (event) => {

      isDragging = true;

      startX = event.clientX;

      track.style.transition = "none";

    }
  );


  window.addEventListener(
    "mousemove",
    (event) => {

      if (!isDragging) return;

      currentX = event.clientX;

    }
  );


  window.addEventListener(
    "mouseup",
    () => {

      if (!isDragging) return;

      isDragging = false;

      track.style.transition =
        "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";

      const difference =
        currentX - startX;


      if (Math.abs(difference) > 50) {

        if (difference < 0) {

          nextSlide();

        } else {

          previousSlide();

        }

        restartAutoPlay();

      }

    }
  );


  /* =========================================
     SWIPE NO CELULAR
  ========================================= */

  track.addEventListener(
    "touchstart",
    (event) => {

      startX =
        event.touches[0].clientX;

    },
    { passive: true }
  );


  track.addEventListener(
    "touchend",
    (event) => {

      currentX =
        event.changedTouches[0].clientX;

      const difference =
        currentX - startX;


      if (Math.abs(difference) > 50) {

        if (difference < 0) {

          nextSlide();

        } else {

          previousSlide();

        }

        restartAutoPlay();

      }

    },
    { passive: true }
  );


  /* =========================================
     AUTOPLAY
  ========================================= */

  function startAutoPlay() {

    autoPlay = setInterval(() => {

      nextSlide();

    }, 5000);

  }


  function restartAutoPlay() {

    clearInterval(autoPlay);

    startAutoPlay();

  }


  /* =========================================
     PAUSAR AO PASSAR O MOUSE
  ========================================= */

  wrapper.addEventListener(
    "mouseenter",
    () => {

      clearInterval(autoPlay);

    }
  );


  wrapper.addEventListener(
    "mouseleave",
    () => {

      startAutoPlay();

    }
  );


  /* =========================================
     RESPONSIVIDADE
  ========================================= */

  window.addEventListener(
    "resize",
    () => {

      const totalSlides =
        getTotalSlides();

      if (currentSlide >= totalSlides) {

        currentSlide =
          totalSlides - 1;

      }

      updateCarousel();

    }
  );


  /* =========================================
     INICIALIZAÇÃO
  ========================================= */

  updateCarousel();

  startAutoPlay();

});