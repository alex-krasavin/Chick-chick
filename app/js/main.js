const API_URL = "https://shining-enshrined-scorpio.glitch.me/";

// GET /api - получить список услуг
// GET /api?service={n} - получить список барберов
// GET /api?spec={n} - получить список месяца работы барбера
// GET /api?spec={n}&month={n} - получить список дней работы барбера
// GET /api?spec={n}&month={n}&day={n} - получить список свободных часов барбера
// POST /api/order - оформить заказ

window.addEventListener("DOMContentLoaded",init);

function init () {
    initSlider();
    initService();
    initReserve();
}

function addDisabled (arr) {
    arr.forEach(elem => {
        elem.disabled = true;
    })
}

function removeDisabled (arr) {
    arr.forEach(elem => {
        elem.disabled = false;
    })
}

function initReserve() {
    const reserveForm = document.querySelector(".reserve__form");
    const {fieldService,fieldspec,fieldmonth,fielddate,fieldtime,btn} = reserveForm;

    addDisabled ([fieldspec,fieldmonth,fielddate,fieldtime,btn]);

    reserveForm.addEventListener("change",async(e)=> {
        const target = e.target;
        if(target.name === "service") {
            addDisabled ([fieldspec,fieldmonth,fielddate,fieldtime,btn]);
            fieldspec.innerHTML = `<legend class="reserve__legend">Специалист</legend>`;
            addPreload(fieldspec)
            const response = await fetch(`${API_URL}/api?service=${target.value}`);
            const data = await response.json();
            renderSpec(fieldspec,data);
            removePreload(fieldspec);
            removeDisabled([fieldspec]);
        }
        if(target.name === "spec") {
            addDisabled ([fieldmonth,fielddate,fieldtime,btn]);
            addPreload(fieldmonth)
            const response = await fetch(`${API_URL}/api?spec=${target.value}`);
            const data = await response.json();
            fieldmonth.textContent = "";
            renderMonth(fieldmonth,data);
            removePreload(fieldmonth);
            removeDisabled([fieldmonth]);
        }
        if(target.name === "month") {
            addDisabled ([fielddate,fieldtime,btn]);
            addPreload(fielddate)
            const response = await fetch(`${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}`);
            const data = await response.json();
            fielddate.textContent = "";
            renderDay(fielddate,data,reserveForm.month.value);
            removePreload(fielddate);
            removeDisabled([fielddate]);
        }
        if(target.name === "date") {
            addDisabled ([fieldtime,btn]);
            addPreload(fieldtime)
            const response = await fetch(`${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}&day=${target.value}`);
            const data = await response.json();
            fieldtime.textContent = "";
            renderTime(fieldtime,data);
            removePreload(fieldtime);
            removeDisabled([fieldtime]);
        }
        if(target.name === "time") {
            removeDisabled([btn]);
        }
    });

    reserveForm.addEventListener("submit",async (e) => {
        e.preventDefault();
        
        const formData = new FormData(reserveForm);
        const json = JSON.stringify(Object.fromEntries(formData));

        const response = await fetch(`${API_URL}api/order`,{
            method:"POST",
            body:json,
        }); 
        const data = await response.json();
        console.log(data)
        addDisabled([fieldService,fieldspec,fieldmonth,fielddate,fieldtime,btn]);
        const message = document.createElement("p");
        message.textContent = `
            #Ваша бронь под N${data.id},
            Ждем вас ${new Intl.DateTimeFormat("ru-Ru",{
                month:"long",
                day:"numeric"
            }).format(new Date(`${data.month}/${data.date}`))},
            время ${data.time}
        `;
        reserveForm.append(message)
        setTimeout(function(){
            location.reload();
        }, 2000);
    });
}

function renderTime (wrapper,data) {
    const labels = data.map(item => {
        const label = document.createElement("label");
        label.classList.add("radio");

        label.innerHTML = `
            <input class="radio__input" type="radio" name="time" value="${item}">
            <span class="radio__label">${item}</span>
        `;
        return label;
    })
    wrapper.append(...labels)
}

function renderDay (wrapper,data,month) {
    const labels = data.map(item => {
        const label = document.createElement("label");
        label.classList.add("radio");

        label.innerHTML = `
            <input class="radio__input" type="radio" name="date" value="${item}">
            <span class="radio__label">${new Intl.DateTimeFormat("ru-Ru",{month:"long",day:"numeric"}).format(new Date (`${month}/${item}`))}</span>
        `;
        return label;
    })
    wrapper.append(...labels)
}

function renderMonth (wrapper,data) {
    const labels = data.map(item => {
        const label = document.createElement("label");
        label.classList.add("radio");

        label.innerHTML = `
            <input class="radio__input" type="radio" name="month" value="${item}">
            <span class="radio__label">${new Intl.DateTimeFormat("ru-Ru",{month:"long"}).format(new Date (item))}</span>
        `;
        return label;
    })
    wrapper.append(...labels)
}

function renderSpec (wrapper,data) {
    const labels = data.map(item => {
        const label = document.createElement("label");
        label.classList.add("radio");

        label.innerHTML = `
            <input class="radio__input" type="radio" name="spec" value="${item.id}">
            <span class="radio__label radio__label--spec" style="--bg-img: url(${API_URL}/${item.img});">${item.name}</span>
        `;
        return label;
    })
    wrapper.append(...labels)
}

function renderService (wrapper,data) {
    const labels = data.map(item => {
        const label = document.createElement("label");
        label.classList.add("radio");

        label.innerHTML = `
            <input class="radio__input" type="radio" name="service" value="${item.id}">
            <span class="radio__label">${item.name}</span>
        `;
        return label;
    })
    wrapper.append(...labels)
}

function renderPrice (wrapper,data) {
    data.forEach(item => {
        const priceItem = document.createElement("li");
        priceItem.classList.add("price__item");

        priceItem.innerHTML = `
            <span class="price__item-text">${item.name}</span>  <span class="price__value">${item.price} руб</span>
        `;
        wrapper.append(priceItem);
    });
}

function initService () {
    const priceList = document.querySelector(".price__list");
    const reserveFieldsetService = document.querySelector(".reserve__fieldset--service");

    priceList.textContent = "";
    addPreload(priceList);

    reserveFieldsetService.innerHTML = "<legend class='reserve__legend'>Услуга</legend>";
    addPreload(reserveFieldsetService);

    fetch(`${API_URL}/api`)
        .then((response)=> {
            return response.json();
        })
        .then((data) => {
            renderPrice(priceList,data);
            removePreload(priceList);
            return data;
        })
        .then(data => {
            renderService(reserveFieldsetService,data);
            removePreload(reserveFieldsetService);
        })
}

// slider

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









          
