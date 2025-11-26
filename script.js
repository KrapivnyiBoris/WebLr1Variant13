document.addEventListener('DOMContentLoaded', () => {
    // === ЕЛЕМЕНТИ ===
    let xInput = document.getElementById('x_input');
    let yInput = document.getElementById('y_input');
    const swapBtn = document.getElementById('swap_btn');
    const calculateBtn = document.getElementById('calculate_btn');
    const jsOutputArea = document.getElementById('js-output-area');
    
    // Елементи для обміну
    const headerInner = document.getElementById('header-inner');
    const footerInner = document.getElementById('footer-inner');

    // Блок тексту з правого меню (для довжини сторони C)
    const block4Content = document.getElementById('block-4-content');

    // Контейнер з кнопками (це наша "форма" управління, яку треба ховати)
    const controlsContainer = document.querySelector('.left div[style*="border-bottom"]'); 
    // Або можна ховати самі кнопки:
    // const controlsContainer = document.getElementById('calculate_btn').parentNode;

    // === ФУНКЦІЇ COOKIES ===
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function eraseCookie(name) {   
        document.cookie = name+'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    // === ЛОГІКА ЗАВАНТАЖЕННЯ (П.3 а, б) ===
    const savedResult = getCookie('triangle_res');
    
    if (savedResult) {
        // Умова: "не виводиться згадана вище форма"
        if (controlsContainer) controlsContainer.style.display = 'none';
        if (xInput) xInput.disabled = true; // Блокуємо інпути
        if (yInput) yInput.disabled = true;

        // Умова: "виводиться інформація з cookies із повідомленням..."
        const userChoice = confirm(
            `Збережений результат: ${savedResult}\n\n` +
            `Натисніть "ОК", щоб видалити дані з Cookies і відновити роботу форми.`
        );

        if (userChoice) {
            // Умова б: видаляються cookies, виводиться повідомлення, перезавантаження
            eraseCookie('triangle_res');
            alert("Cookies видалено! Зараз сторінка оновиться.");
            location.reload(); // Перезавантажує сторінку до початкового стану
        } else {
            // Якщо користувач натиснув "Скасувати", форма залишається прихованою
            alert("Cookies залишено. Оновіть сторінку, щоб спробувати знову.");
        }
    }

    // === 1. ОБМІН (Без змін, бо працює добре) ===
    function swapBlockContents() {
        if (!headerInner || !footerInner) return;
        
        const savedX = xInput ? xInput.value : '10';
        const savedY = yInput ? yInput.value : '20';

        const temp = headerInner.innerHTML;
        headerInner.innerHTML = footerInner.innerHTML;
        footerInner.innerHTML = temp;
        
        xInput = document.getElementById('x_input');
        yInput = document.getElementById('y_input');

        if (xInput) xInput.value = savedX;
        if (yInput) yInput.value = savedY;
    }

    // === 2. ОБЧИСЛЕННЯ (З Alerts замість тексту) ===
    function calculate() {
        if (!xInput || !yInput) return;

        const x = parseFloat(xInput.value);
        const y = parseFloat(yInput.value);
        const c = block4Content ? block4Content.innerText.length : 0; 

        if (isNaN(x) || isNaN(y) || x <= 0 || y <= 0) {
            alert("Будь ласка, введіть коректні значення X та Y!");
            return;
        }

        // 1. Площа п'ятикутника (виводимо в блок 3, як в завданні 2)
        const area = (5 * x * y) / 2;
        jsOutputArea.innerHTML = `Площа п'ятикутника: <strong>${area}</strong>`;
        jsOutputArea.style.display = 'block';

        // 2. Трикутник (Завдання 3 - виводимо через ALERT і зберігаємо в COOKIES)
        const isTriangle = (x + y > c) && (x + c > y) && (y + c > x);
        let triangleMsg = "";

        if (isTriangle) {
            triangleMsg = `Трикутник зі сторін (${x}, ${y}, ${c}) МОЖНА побудувати.`;
        } else {
            triangleMsg = `Трикутник зі сторін (${x}, ${y}, ${c}) НЕ МОЖНА побудувати.`;
        }

        // Виводимо результат діалоговим вікном
        alert(triangleMsg);

        // Зберігаємо в Cookies
        setCookie('triangle_res', triangleMsg, 7);
        
        // Повідомляємо, що дані збережено (опціонально, для зручності)
        console.log("Результат збережено в Cookies. Оновіть сторінку для перевірки.");
    }

    // Слухачі
    if (swapBtn) swapBtn.addEventListener('click', swapBlockContents);
    if (calculateBtn) calculateBtn.addEventListener('click', calculate);

   // =======================================================
    // ЗАВДАННЯ №4: Blur на X/Y управляє текстом Блоку 4
    // =======================================================

    const capitalizeCheckbox = document.getElementById('capitalize_checkbox');
    const block4Container = document.getElementById('block-4-text-container');
    // Знаходимо поля X та Y для відстеження Blur
    const inputX = document.getElementById('x_input');
    const inputY = document.getElementById('y_input');

    // 1. Допоміжна функція: робить перші літери великими
    function toTitleCase(str) {
        return str.toLowerCase().replace(/(^|\s)\S/g, function(letter) { 
            return letter.toUpperCase(); 
        });
    }

    // 2. Головна функція: знаходить весь текст у Блоці 4 і міняє його
    function capitalizeBlock4() {
        if (!block4Container) return;

        // Шукаємо всі текстові елементи: параграфи, заголовки, пункти списку
        const allTextElements = block4Container.querySelectorAll('p, h3, li');
        
        allTextElements.forEach(el => {
            el.innerText = toTitleCase(el.innerText);
        });
        console.log("Текст у Блоці 4 перетворено на Title Case.");
    }

    // 3. ЛОГІКА BLUR (на полях X та Y)
    // Коли користувач виходить з поля X
    if (inputX) {
        inputX.addEventListener('blur', () => {
            if (capitalizeCheckbox && capitalizeCheckbox.checked) {
                capitalizeBlock4();
            }
        });
    }

    // Коли користувач виходить з поля Y
    if (inputY) {
        inputY.addEventListener('blur', () => {
            if (capitalizeCheckbox && capitalizeCheckbox.checked) {
                capitalizeBlock4();
            }
        });
    }

    // 4. ЛОГІКА ЗАВАНТАЖЕННЯ та ГАЛОЧКИ
    if (capitalizeCheckbox) {
        // А) При завантаженні сторінки (відновлення стану)
        const savedState = localStorage.getItem('capitalizeEnabled');
        
        if (savedState === 'true') {
            capitalizeCheckbox.checked = true;
            // Одразу міняємо текст, бо так записано в пам'яті
            capitalizeBlock4();
        } else {
            capitalizeCheckbox.checked = false;
        }

        // Б) При кліку на галочку (Тільки зберігаємо, текст не чіпаємо)
        capitalizeCheckbox.addEventListener('change', () => {
            localStorage.setItem('capitalizeEnabled', capitalizeCheckbox.checked);
        });
    }
});

