document.addEventListener('DOMContentLoaded', () => {
    let xInput = document.getElementById('x_input');
    let yInput = document.getElementById('y_input');
    const swapBtn = document.getElementById('swap_btn');
    const calculateBtn = document.getElementById('calculate_btn');
    const jsOutputArea = document.getElementById('js-output-area');
    
    const headerInner = document.getElementById('header-inner');
    const footerInner = document.getElementById('footer-inner');

    const capitalizeCheckbox = document.getElementById('capitalize_checkbox');
    const block4Container = document.getElementById('block-4-text-container');

    function setCookie(name, value, days) {
        let d = new Date(); d.setTime(d.getTime() + (days*24*60*60*1000));
        document.cookie = name + "=" + encodeURIComponent(value || "") + "; expires=" + d.toUTCString() + "; path=/";
    }

    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for(let i=0;i < ca.length;i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length,c.length));
        }
        return null;
    }

    function eraseCookie(name) {   
        document.cookie = name+'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    const editTargets = {
        1: document.getElementById('text-to-swap-1'),
        2: document.querySelector('.left h3'),
        3: document.querySelector('.content h2'),
        4: document.querySelector('#block-4-text-container p'),
        5: document.querySelector('.bottom h3'),
        6: document.getElementById('text-to-swap-6')
    };

    const initialContent = {}; 
    for (let key in editTargets) {
        if (editTargets[key]) {
            initialContent[key] = editTargets[key].innerHTML;
            const saved = localStorage.getItem(`block_edit_${key}`);
            if (saved) editTargets[key].innerHTML = saved;
        }
    }

    function createControlList() {
        if (!jsOutputArea) return;
        if (document.getElementById('task5-list-container')) return;

        const listContainer = document.createElement('div');
        listContainer.id = 'task5-list-container';
        
        listContainer.innerHTML = '<h4>Панель редагування (Завдання 5):</h4><p style="font-size:12px; color:#555;">Двічі клікніть по пункту, щоб змінити блок.</p>';
        
        const list = document.createElement('ol');

        for (let i = 1; i <= 6; i++) {
            const li = document.createElement('li');
            li.textContent = `Редагувати Блок ${i}`;
            li.className = 'edit-list-item'; 
            li.style.cursor = 'pointer'; 
            li.style.margin = '5px 0'; 
            
            li.addEventListener('dblclick', () => startEditing(i));
            list.appendChild(li);
        }
        
        listContainer.appendChild(list);
        jsOutputArea.appendChild(listContainer);
    }

    function startEditing(blockNum) {
        const targetElement = editTargets[blockNum];
        if (!targetElement) return alert("Елемент не знайдено!");

        const currentText = targetElement.innerHTML;
        const formContainer = document.createElement('div');
        formContainer.style.border = "2px solid red";
        formContainer.style.padding = "10px";
        formContainer.style.background = "#fff";
        formContainer.style.color = "#000";
        formContainer.style.marginBottom = "15px";

        const textarea = document.createElement('textarea');
        textarea.value = currentText;
        textarea.style.width = "100%";
        textarea.style.height = "60px";
        textarea.style.marginBottom = "10px";

        const saveBtn = document.createElement('button');
        saveBtn.textContent = "Зберегти (в LS)";
        saveBtn.style.marginRight = "5px";
        saveBtn.style.backgroundColor = "green";
        saveBtn.style.color = "white";
        
        saveBtn.onclick = () => {
            const newText = textarea.value;
            targetElement.innerHTML = newText;
            localStorage.setItem(`block_edit_${blockNum}`, newText);
            targetElement.style.display = ""; 
            formContainer.remove();
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Відновити (Видалити з LS)";
        deleteBtn.style.backgroundColor = "orange";
        deleteBtn.style.marginRight = "5px";
        
        deleteBtn.onclick = () => {
            localStorage.removeItem(`block_edit_${blockNum}`);
            targetElement.innerHTML = initialContent[blockNum];
            targetElement.style.display = ""; 
            formContainer.remove();
        };

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = "Скасувати";
        cancelBtn.onclick = () => {
            targetElement.style.display = ""; 
            formContainer.remove();
        }

        formContainer.appendChild(textarea);
        formContainer.appendChild(document.createElement('br'));
        formContainer.appendChild(saveBtn);
        formContainer.appendChild(deleteBtn);
        formContainer.appendChild(cancelBtn);

        targetElement.style.display = "none";
        targetElement.parentNode.insertBefore(formContainer, targetElement);
    }

    const savedResult = getCookie('triangle_res');
    
    if (savedResult) {
        const controls = document.querySelector('.controls-wrapper');
        if (controls) controls.style.display = 'none';
        
        if (xInput) xInput.disabled = true;
        if (yInput) yInput.disabled = true;
        
        if (jsOutputArea) jsOutputArea.style.display = 'none';

        setTimeout(() => {
            const userChoice = confirm(`Збережено результат:\n\n${savedResult}\n\nНатисніть "ОК", щоб видалити дані з Cookies і відновити роботу.`);
            
            if (userChoice) {
                eraseCookie('triangle_res');
                alert("Cookies видалено! Зараз сторінка оновиться.");
                location.reload();
            } else {
                alert("Ви натиснули Скасувати. Оновіть сторінку вручну, коли захочете скинути результат.");
            }
        }, 200);

    } else {
        createControlList();
    }

    function toTitleCase(str) {
        return str.toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase());
    }

    function capitalizeBlock4() {
        if (!block4Container) return;
        const allText = block4Container.querySelectorAll('p, h3, li');
        allText.forEach(el => el.innerText = toTitleCase(el.innerText));
    }

    document.addEventListener('focusout', (event) => {
        if (event.target && (event.target.id === 'x_input' || event.target.id === 'y_input')) {
            if (capitalizeCheckbox && capitalizeCheckbox.checked) {
                capitalizeBlock4();
            }
        }
    });

    if (capitalizeCheckbox) {
        const savedCap = localStorage.getItem('capitalizeEnabled');
        if (savedCap === 'true') {
            capitalizeCheckbox.checked = true;
            capitalizeBlock4();
        }
        capitalizeCheckbox.addEventListener('change', () => {
            localStorage.setItem('capitalizeEnabled', capitalizeCheckbox.checked);
        });
    }

    function swapBlockContents() {
        if (!headerInner || !footerInner) return alert("Помилка структури HTML");
        
        const valX = xInput ? xInput.value : '';
        const valY = yInput ? yInput.value : '';

        const temp = headerInner.innerHTML;
        headerInner.innerHTML = footerInner.innerHTML;
        footerInner.innerHTML = temp;
        
        xInput = document.getElementById('x_input');
        yInput = document.getElementById('y_input');
        if (xInput) xInput.value = valX;
        if (yInput) yInput.value = valY;
    }

    function calculate() {
        if (!xInput || !yInput) return alert("Немає полів X/Y");
        const x = parseFloat(xInput.value);
        const y = parseFloat(yInput.value);
        const pElem = document.querySelector('#block-4-text-container p');
        const c = pElem ? pElem.innerText.length : 0;

        if (isNaN(x) || isNaN(y)) return alert("Введіть числа!");

        const area = (5 * x * y) / 2;
        const isTriangle = (x + y > c) && (x + c > y) && (y + c > x);
        
        const resultTextElem = document.getElementById('result-text');
        if (resultTextElem) resultTextElem.innerHTML = `Площа п'ятикутника: ${area}`;

        let msg = `Результати:\n`;
        msg += `----------------\n`;
        msg += `Площа п'ятикутника: ${area}\n`;
        msg += `----------------\n`;
        msg += `Перевірка трикутника (C=${c}):\n`;
        
        if (isTriangle) msg += "Висновк: Трикутник МОЖНА побудувати.";
        else msg += "Висновок: Трикутник НЕ МОЖНА побудувати.";

        alert(msg);
        
        setCookie('triangle_res', msg, 7);
    }

    if (swapBtn) swapBtn.addEventListener('click', swapBlockContents);
    if (calculateBtn) calculateBtn.addEventListener('click', calculate);
});