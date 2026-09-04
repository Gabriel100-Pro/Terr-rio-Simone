document.addEventListener(
  "DOMContentLoaded",
  () => {


    /* =====================================================
       CARROSSEL DE PRODUTOS
    ====================================================== */

    const productTrack =
      document.querySelector(
        ".products-track"
      );

    const productWrapper =
      document.querySelector(
        ".products-track-wrapper"
      );

    const prevButton =
      document.querySelector(
        ".carousel-prev"
      );

    const nextButton =
      document.querySelector(
        ".carousel-next"
      );

    const dots =
      document.querySelectorAll(
        ".carousel-dot"
      );

    const productCards =
      document.querySelectorAll(
        ".product-card"
      );


    let currentSlide = 0;

    let autoPlay = null;

    let startX = 0;

    let currentX = 0;

    let isDragging = false;



    /* =====================================================
       QUANTIDADE DE CARDS
    ====================================================== */

    function getVisibleCards() {

      const width =
        window.innerWidth;


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



    /* =====================================================
       TOTAL DE SLIDES
    ====================================================== */

    function getTotalSlides() {

      if (!productCards.length) {
        return 1;
      }


      return Math.max(
        1,
        productCards.length -
        getVisibleCards() +
        1
      );

    }



    /* =====================================================
       ATUALIZAR CARROSSEL
    ====================================================== */

    function updateCarousel() {

      if (
        !productTrack ||
        !productCards.length
      ) {
        return;
      }


      const cardWidth =
        productCards[0].offsetWidth;


      const gap =
        parseFloat(
          getComputedStyle(
            productTrack
          ).gap
        ) || 0;


      const offset =
        currentSlide *
        (
          cardWidth +
          gap
        );


      productTrack.style.transform =
        `translateX(-${offset}px)`;


      dots.forEach(
        (
          dot,
          index
        ) => {

          dot.classList.toggle(
            "active",
            index === currentSlide
          );

        }
      );

    }



    /* =====================================================
       PRÓXIMO
    ====================================================== */

    function nextSlide() {

      const total =
        getTotalSlides();


      currentSlide++;

      if (
        currentSlide >= total
      ) {
        currentSlide = 0;
      }


      updateCarousel();

    }



    /* =====================================================
       ANTERIOR
    ====================================================== */

    function previousSlide() {

      const total =
        getTotalSlides();


      currentSlide--;


      if (
        currentSlide < 0
      ) {
        currentSlide =
          total - 1;
      }


      updateCarousel();

    }



    /* =====================================================
       AUTOPLAY
    ====================================================== */

    function startAutoPlay() {

      clearInterval(
        autoPlay
      );


      autoPlay =
        setInterval(
          nextSlide,
          5000
        );

    }


    function stopAutoPlay() {

      clearInterval(
        autoPlay
      );

      autoPlay = null;

    }



    /* =====================================================
       BOTÕES
    ====================================================== */

    if (nextButton) {

      nextButton.addEventListener(
        "click",
        () => {

          nextSlide();

          startAutoPlay();

        }
      );

    }


    if (prevButton) {

      prevButton.addEventListener(
        "click",
        () => {

          previousSlide();

          startAutoPlay();

        }
      );

    }



    /* =====================================================
       DOTS
    ====================================================== */

    dots.forEach(
      (
        dot,
        index
      ) => {

        dot.addEventListener(
          "click",
          () => {

            currentSlide =
              Math.min(
                index,
                getTotalSlides() - 1
              );

            updateCarousel();

            startAutoPlay();

          }
        );

      }
    );



    /* =====================================================
       DRAG DESKTOP
    ====================================================== */

    if (productTrack) {

      productTrack.addEventListener(
        "mousedown",
        (event) => {

          isDragging = true;

          startX =
            event.clientX;

          currentX =
            event.clientX;

          productTrack.classList.add(
            "dragging"
          );

          stopAutoPlay();

        }
      );


      window.addEventListener(
        "mousemove",
        (event) => {

          if (!isDragging) {
            return;
          }

          currentX =
            event.clientX;

        }
      );


      window.addEventListener(
        "mouseup",
        () => {

          if (!isDragging) {
            return;
          }

          isDragging = false;

          productTrack.classList.remove(
            "dragging"
          );


          const difference =
            currentX -
            startX;


          if (
            Math.abs(
              difference
            ) > 50
          ) {

            if (
              difference < 0
            ) {

              nextSlide();

            } else {

              previousSlide();

            }

          }


          startAutoPlay();

        }
      );



      /* =================================================
         TOUCH MOBILE
      ================================================== */

      productTrack.addEventListener(
        "touchstart",
        (event) => {

          startX =
            event.touches[0]
              .clientX;

        },
        {
          passive: true
        }
      );


      productTrack.addEventListener(
        "touchend",
        (event) => {

          currentX =
            event.changedTouches[0]
              .clientX;


          const difference =
            currentX -
            startX;


          if (
            Math.abs(
              difference
            ) > 50
          ) {

            if (
              difference < 0
            ) {

              nextSlide();

            } else {

              previousSlide();

            }

          }


          startAutoPlay();

        },
        {
          passive: true
        }
      );


      if (productWrapper) {

        productWrapper.addEventListener(
          "mouseenter",
          stopAutoPlay
        );


        productWrapper.addEventListener(
          "mouseleave",
          startAutoPlay
        );

      }

    }



    /* =====================================================
       INICIALIZAR PRODUTOS
    ====================================================== */

    updateCarousel();

    startAutoPlay();



    /* =====================================================
       NOVA SEÇÃO
       CONTADORES
    ====================================================== */

    const universeSection =
      document.querySelector(
        ".universe-section"
      );


    const counters =
      document.querySelectorAll(
        ".stat-number"
      );


    let countersStarted = false;



    /* =====================================================
       ANIMAÇÃO DOS NÚMEROS
    ====================================================== */

    function animateCounter(
      element
    ) {

      const target =
        Number(
          element.dataset.target
        );


      const prefix =
        element.dataset.prefix ||
        "";


      const suffix =
        element.dataset.suffix ||
        "";


      const duration =
        2200;


      const startTime =
        performance.now();


      function update(
        currentTime
      ) {

        const elapsed =
          currentTime -
          startTime;


        const progress =
          Math.min(
            elapsed /
            duration,
            1
          );


        /*
          Easing suave.
        */

        const eased =
          1 -
          Math.pow(
            1 - progress,
            3
          );


        const value =
          Math.floor(
            eased *
            target
          );


        element.textContent =
          prefix +
          value +
          suffix;


        if (
          progress < 1
        ) {

          requestAnimationFrame(
            update
          );

        } else {

          element.textContent =
            prefix +
            target +
            suffix;

        }

      }


      requestAnimationFrame(
        update
      );

    }



    /* =====================================================
       OBSERVER DOS NÚMEROS
    ====================================================== */

    if (
      universeSection &&
      counters.length
    ) {

      const counterObserver =
        new IntersectionObserver(
          (
            entries,
            observer
          ) => {

            entries.forEach(
              (entry) => {

                if (
                  entry.isIntersecting &&
                  !countersStarted
                ) {

                  countersStarted =
                    true;


                  counters.forEach(
                    animateCounter
                  );


                  observer.disconnect();

                }

              }
            );

          },
          {
            threshold: 0.35
          }
        );


      counterObserver.observe(
        universeSection
      );

    }



    /* =====================================================
       CARDS INFERIORES
       LOOP INFINITO
    ====================================================== */

    const cardsTrack =
      document.querySelector(
        "#universeCardsTrack"
      );


    if (cardsTrack) {

      let position = 0;

      let speed = 0.55;

      let paused = false;

      let originalWidth = 0;


      /*
        Como temos os mesmos
        3 cards duplicados,
        usamos metade da largura
        para criar o loop infinito.
      */

      function calculateWidth() {

        originalWidth =
          cardsTrack.scrollWidth /
          2;

      }


      calculateWidth();


      /* =================================================
         LOOP DOS CARDS
      ================================================== */

      function animateCards() {

        if (!paused) {

          position -= speed;


          if (
            Math.abs(position) >=
            originalWidth
          ) {

            position = 0;

          }


          cardsTrack.style.transform =
            `translate3d(${position}px, 0, 0)`;

        }


        requestAnimationFrame(
          animateCards
        );

      }


      animateCards();



      /* =================================================
         PAUSAR AO PASSAR MOUSE
      ================================================== */

      const cardsWindow =
        document.querySelector(
          ".universe-cards-window"
        );


      if (cardsWindow) {

        cardsWindow.addEventListener(
          "mouseenter",
          () => {

            paused = true;

          }
        );


        cardsWindow.addEventListener(
          "mouseleave",
          () => {

            paused = false;

          }
        );

      }



      /* =================================================
         TOUCH MOBILE
      ================================================== */

      if (cardsWindow) {

        cardsWindow.addEventListener(
          "touchstart",
          () => {

            paused = true;

          },
          {
            passive: true
          }
        );


        cardsWindow.addEventListener(
          "touchend",
          () => {

            setTimeout(
              () => {

                paused = false;

              },
              700
            );

          },
          {
            passive: true
          }
        );

      }



      /* =================================================
         RESIZE
      ================================================== */

      window.addEventListener(
        "resize",
        () => {

          calculateWidth();

        }
      );

    }



    /* =====================================================
       SCROLL INDICATOR
    ====================================================== */

    const heroScroll =
      document.querySelector(
        "#heroScroll"
      );


    if (heroScroll) {

      window.addEventListener(
        "scroll",
        () => {

          if (
            window.scrollY > 100
          ) {

            heroScroll.style.opacity =
              "0";

          } else {

            heroScroll.style.opacity =
              "1";

          }

        },
        {
          passive: true
        }
      );

    }



    /* =====================================================
       SMOOTH SCROLL
    ====================================================== */

    document
      .querySelectorAll(
        'a[href^="#"]'
      )
      .forEach(
        (anchor) => {

          anchor.addEventListener(
            "click",
            (event) => {

              const targetId =
                anchor.getAttribute(
                  "href"
                );


              if (
                !targetId ||
                targetId === "#"
              ) {
                return;
              }


              const target =
                document.querySelector(
                  targetId
                );


              if (!target) {
                return;
              }


              event.preventDefault();


              window.scrollTo({

                top:
                  target.getBoundingClientRect()
                    .top +
                  window.scrollY,

                behavior:
                  "smooth"

              });

            }
          );

        }
      );



    /* =====================================================
       REVEAL AO ENTRAR NA VIEWPORT
       (CUIDADOS / CONTATO)
    ====================================================== */

    const revealElements =
      document.querySelectorAll(
        "[data-reveal]"
      );


    if (revealElements.length) {

      const revealObserver =
        new IntersectionObserver(
          (entries, observer) => {

            entries.forEach(
              (entry) => {

                if (entry.isIntersecting) {

                  entry.target.classList.add(
                    "is-visible"
                  );


                  observer.unobserve(
                    entry.target
                  );

                }

              }
            );

          },
          {
            threshold: 0.2
          }
        );


      revealElements.forEach(
        (element) => {

          revealObserver.observe(
            element
          );

        }
      );

    }

  }
);