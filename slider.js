document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("sliderTrack");
    const dotsContainer = document.getElementById("dotsContainer");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");

    // Получаем оригинальные слайды
    const originalSlides = Array.from(track.children);
    const slideCount = originalSlides.length;

    // Клонируем первый и последний слайды
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[slideCount - 1].cloneNode(true);

    // Добавляем клоны: [клон3] [1] [2] [3] [клон1]
    track.appendChild(firstClone);
    track.insertBefore(lastClone, track.children[0]);

    const allSlides = Array.from(track.children);
    let currentIndex = 1; // Начинаем с первого оригинала
    let isAnimating = false;

    // Создаем точки только для оригинальных слайдов
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(i + 1));
        dotsContainer.appendChild(dot);
    }

    const dots = Array.from(dotsContainer.children);

    function goToSlide(index) {
        if (isAnimating) return;
        currentIndex = index;
        updateSlider();
    }

    function updateSlider(instant = false) {
        if (instant) {
            track.classList.add("no-transition");
        } else {
            track.classList.remove("no-transition");
        }

        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;

        // Обновляем точки для оригинальных слайдов
        const dotIndex = (currentIndex - 1 + slideCount) % slideCount;
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === dotIndex);
        });
    }

    function handleTransitionEnd() {
        isAnimating = false;

        // Проверяем границы и мгновенно перескакиваем если нужно
        if (currentIndex === 0) {
            // Достигли клона3 слева - перескакиваем на оригинал3
            currentIndex = slideCount;
            updateSlider(true);
        } else if (currentIndex === allSlides.length - 1) {
            // Достигли клона1 справа - перескакиваем на оригинал1
            currentIndex = 1;
            updateSlider(true);
        }
    }

    prevBtn.addEventListener("click", () => {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex--;
        updateSlider();
    });

    nextBtn.addEventListener("click", () => {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex++;
        updateSlider();
    });

    // Слушаем окончание анимации
    track.addEventListener("transitionend", handleTransitionEnd);

    // Инициализация - устанавливаем начальную позицию
    updateSlider(true);

    // Автопрокрутка
    setInterval(() => {
        if (!isAnimating) {
            nextBtn.click();
        }
    }, 5000);
});
