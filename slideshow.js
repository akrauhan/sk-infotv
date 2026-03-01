document.addEventListener("DOMContentLoaded", function () {

    const slideshowColumn = document.querySelector(".right-panel");
    if (!slideshowColumn) return;

    const slideshow = slideshowColumn.querySelector(".slideshow");
    const clock = slideshowColumn.querySelector(".slideshow-clock");
    const date  = slideshowColumn.querySelector(".slideshow-date");
    const timerBar = slideshowColumn.querySelector(".timer-bar");

    if (!slideshow) return;

    // CLOCK UPDATE
    function updateClock() {
        const now = new Date();
        const h = now.getHours().toString().padStart(2, "0");
        const m = now.getMinutes().toString().padStart(2, "0");
        const s = now.getSeconds().toString().padStart(2, "0");
        clock.textContent = `${h}:${m}:${s}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    const now = new Date();
    const dayname = now.getDay(); //Sunday - Saturday: 0-6
    let day = "";

    switch (dayname) {
        case 0:
            day = "Sunnuntai";
            break;
        case 1:
            day = "Maanantai";
            break;
        case 2:
            day = "Tiistai";
            break;
        case 3:
            day = "Keskiviikko";
            break;
        case 4:
            day = "Torstai";
            break;
        case 5:
            day = "Perjantai";
            break;
        case 6:
            day = "Lauantai";
        default:
            day = "";
    }

    date.textContent = `${day} ${(now.getDate()).toString()}.${(now.getMonth()+1).toString()}.`;


    const MAX_DURATION = 30000;
    const DEFAULT_DURATION = 8000;

    const slides = Array.from(slideshow.querySelectorAll("img.slide"));
    if (slides.length === 0) return;

    function getDuration(img) {
        let parsed = DEFAULT_DURATION;
        const filename = img.src.split("/").pop();
        const match = filename.match(/(?:^|\D)(\d+)s(?:\D|$)/i);
        if (match) parsed = parseInt(match[1], 10) * 1000;
        return parsed > MAX_DURATION ? MAX_DURATION : parsed;
    }

    let index = 0;
    slides[index].classList.add("active");

    function startTimer(duration) {
        timerBar.style.transition = "none";
        timerBar.style.width = "0%";
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                timerBar.style.transition = `width ${duration}ms linear`;
                timerBar.style.width = "100%";
            });
        });
    }

    function nextSlide() {
        slides[index].classList.remove("active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("active");

        const duration = getDuration(slides[index]);
        startTimer(duration);
        setTimeout(nextSlide, duration);
    }

    // Start slideshow
    const initialDuration = getDuration(slides[0]);
    startTimer(initialDuration);
    setTimeout(nextSlide, initialDuration);
});