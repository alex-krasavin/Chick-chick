window.addEventListener("DOMContentLoaded",initSlider);

function addPreload (elem) {
    elem.classList.add("preload");
}

function removePreload (elem) {
    elem.classList.remove("preload");
}

function startSlider() {
    const sliderItems = document.querySelectorAll(".slider__item"),
            sliderList  = document.querySelector(".slider__list"),
            btnNextSlide = document.querySelector(".slider__arrow--right"),
            btnPrevSlide = document.querySelector(".slider__arrow--left");

    let activeSlide = 1;
    let position = 0;

    function checkSlider () {
        if((activeSlide + 2 === sliderItems.length && document.documentElement.offsetWidth > 560) || 
        activeSlide === sliderItems.length) {
            btnNextSlide.classList.add("none")
        }else {
            btnNextSlide.classList.remove("none")
        }

        if(activeSlide <= 1) {
            btnPrevSlide.classList.add("none")
        }else {
            btnPrevSlide.classList.remove("none")
        }
    }

    function nextSlide () {
        sliderItems[activeSlide]?.classList.remove("slider__item--active");
        position = -sliderItems[0].clientWidth * activeSlide;

        sliderList.style.transform = `translateX(${position}px)`;
        activeSlide += 1;
        sliderItems[activeSlide]?.classList.add("slider__item--active");

        checkSlider();
    }

    function prevSlide () {
        sliderItems[activeSlide]?.classList.remove("slider__item--active");
        position = -sliderItems[0].clientWidth * (activeSlide -2);

        sliderList.style.transform = `translateX(${position}px)`;
        activeSlide -= 1;
        sliderItems[activeSlide]?.classList.add("slider__item--active");

        checkSlider();
    }

    btnNextSlide.addEventListener("click",nextSlide);
    btnPrevSlide.addEventListener("click",prevSlide);

    window.addEventListener("resize", () => {
        if (activeSlide + 2 > sliderItems.length && document.documentElement.offsetWidth > 560) {
            activeSlide = sliderItems.length -2;
            sliderItems[activeSlide]?.classList.add("slider__item--active");
        }
        checkSlider();
        position = -sliderItems[0].clientWidth * (activeSlide -1);
        sliderList.style.transform = `translateX(${position}px)`;
    })
}

function initSlider () {
    const slider = document.querySelector(".slider");
    const sliderContainer = document.querySelector(".slider__container");

    sliderContainer.style.display = "none";
    addPreload(slider)
    
    window.addEventListener("load",() => {
        removePreload(slider);
        sliderContainer.style.display = "";
        startSlider(); 
    });
}







          
