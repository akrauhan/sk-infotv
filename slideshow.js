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
    const dayname = now.getDay();
    let day = "";

    switch (dayname) {
        case 0: day = "Sunnuntai"; break;
        case 1: day = "Maanantai"; break;
        case 2: day = "Tiistai"; break;
        case 3: day = "Keskiviikko"; break;
        case 4: day = "Torstai"; break;
        case 5: day = "Perjantai"; break;
        case 6: day = "Lauantai"; break;
        default: day = "";
    }

    date.textContent = `${day} ${now.getDate()}.${now.getMonth()+1}.`;

    const MAX_DURATION = 30000;
    const DEFAULT_DURATION = 8000;

    // Collect both images and videos
    const slides = Array.from(slideshow.querySelectorAll(".slide"));
    if (slides.length === 0) return;

    function getDuration(elem) {
        if (elem.tagName === "VIDEO") return null;

        const img = elem.querySelector("img");
        if (!img) return DEFAULT_DURATION;

        let parsed = DEFAULT_DURATION;
        const filename = img.src.split("/").pop();
        const match = filename.match(/(?:^|\D)(\d+)s(?:\D|$)/i);
        if (match) parsed = parseInt(match[1], 10) * 1000;

        return parsed > MAX_DURATION ? MAX_DURATION : parsed;
    }   

    let index = 0;

    function startTimer(duration) {
        if (duration === null) {
            timerBar.style.width = "0%";
            timerBar.style.transition = "none";
            return;
        }

        timerBar.style.transition = "none";
        timerBar.style.width = "0%";

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                timerBar.style.transition = `width ${duration}ms linear`;
                timerBar.style.width = "100%";
            });
        });
    }

    function showSlide(i) {
    // STOP all videos before switching
    slides.forEach(s => {
        if (s.tagName === "VIDEO") {
            s.pause();
            s.currentTime = 0;
        }
    });

    // Activate correct slide
    slides.forEach((s, idx) => {
        s.classList.toggle("active", idx === i);
    });

    const current = slides[i];

    if (current.tagName === "VIDEO") {
        current.currentTime = 0;
        current.play();
        startTimer(null);

        current.onended = () => nextSlide();

    } else {
        const duration = getDuration(current);
        startTimer(duration);
        setTimeout(nextSlide, duration);
    }
}

    function nextSlide() {
        index = (index + 1) % slides.length;
        showSlide(index);
    }

    // START
    showSlide(index);

});