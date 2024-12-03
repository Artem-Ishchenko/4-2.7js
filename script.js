//Создал документ при помощи js
const mainDiv = document.createElement('div');
mainDiv.className = 'main';
mainDiv.style.cssText = `
    width: 650px;
    height: 800px;
    background-color: #C4C4C4;
    position: relative;
    margin: auto;
`;
const blockDiv1 = document.createElement('div')
blockDiv1.className = 'blockInput';
blockDiv1.style.cssText = `
    width: 100%;
    height: 50%;
    padding: 50px;
    box-sizing: border-box;
`;
const blockDiv2 = blockDiv1.cloneNode(true);
blockDiv2.classList.replace('blockInput', 'blockSave');
mainDiv.append(blockDiv1,blockDiv2);
document.body.append(mainDiv)
let blockInput = document.querySelector('.blockInput');
let blockSave = document.querySelector('.blockSave');
// Добавил input
blockInput.insertAdjacentHTML('afterbegin', 
`<input class="input" type="text" name="search" placeholder="Let's search..." style=" width:100%; height:70px; font-size: 40px; padding: 10px; box-sizing: border-box"/>`);
let input = document.querySelector('.input');
//события обработки ввода 
const debounce = (fn, debounceTime) => {
    let timer; 
    return function(...args) {
        clearTimeout(timer); 
        if (input.value == '') {
            clearSpisok('spisok');
            return;
        };
        timer = setTimeout(() => {
            fn.apply(this, args); 
        }, debounceTime);
    }
};
//Создам массив в который засуну необходимые данные
let GLOBAL_objectsArray = []; 
let GLOBAL_Max_add = 3; //Эта переменная нужна ограничить кол-во добавленных эелементов 
//сам запрос
const zapros = async(e) => {
    //Действия если запрос пуст
    if(e.target.value.trim() === '') return;
    //проверяю есть ли оповещение о том что репозиторий не найден и убираю его
    let check = document.querySelector('.check')
    if(check !== null) {
        check.remove();
    }
    //запрос
    let response = await fetch(`https://api.github.com/search/repositories?q=${e.target.value}`);
    let answer;
    if(response.ok) {
        answer = await response.json();
    } else {
        console.log("Ошибка HTTP! - " + response.status);
    }
    //очищаю список 
    clearSpisok('spisok');
    GLOBAL_objectsArray = [];
    for(let i = 4; i >= 0; i--) {
        try{
            GLOBAL_objectsArray.push(obj(i+1, answer.items[i].name, answer.items[i].stargazers_count, answer.items[i].owner.login))
            createLi(i+1, answer.items[i].name);
        }catch {}
    }
    //Функция для вывода оповещения о том, что репозиторий не найден
    checkFn(GLOBAL_objectsArray);
}
//Сама фунция оповещения 
const checkFn = (arr) => {
    if (arr.length == 0) {
        blockInput.insertAdjacentHTML('beforeend', `<div class="check" style="width:100%;height:40px; background-color:red;color:white; border-radius:10px; margin-top: 5px; font-size: 25px; padding: 5px; box-sizing: border-box">По вашему запросу <strong>ничего не найдено!</strong></div>`)
    }
}
//функция для создания объекта 
const obj = (id, name, stars, owner) => {
    return {id:id, name:name, stars:stars, owner:owner}
}
//функции для создания элемента списка
const createLi = (id, item) => {
    input.insertAdjacentHTML('afterend', 
        `<li class = "spisok sp-${id}" style=" width:100%; height:45px; font-size: 35px; padding: 2px; box-sizing: border-box; list-style-type: none; border: solid; background-color: #E3E3E3;user-select:none;">${item}</li>`);
    
}
//функция для удаления списка
const clearSpisok = (name) => {
    let spisok = document.querySelectorAll('.'+name);
    for(let li of spisok) {
        li.remove();
    }
}
//повесил обработчик при наведении на элемент списка
const handler = (event) => {
    let target = event.target.closest('li');
    if (!target) return; 
    if (event.type == 'mouseover') {
        event.target.style.background = '#65CDF9';
    }
    if (event.type == 'mouseout') {
        event.target.style.background = '#E3E3E3';
    }
};
blockInput.onmouseover = blockInput.onmouseout = handler;
//Функция которая добавляет запись при нажатии на элемент списка
const addFunck = (event) => {
    //убрал список и очистил input
    let target = event.target.closest('li');
    if (!target) return;
    input.value = '';
    clearSpisok('spisok');
    let idElementAdd = target.className.replace(/[^0-9]/g,""); 
    //делаю запись
    perebor(idElementAdd, GLOBAL_objectsArray)
}
//Функция перебора массива и его анализа
const perebor = (id, arr) => {
    if(GLOBAL_Max_add === 0) {
        blockInput.insertAdjacentHTML('beforeend', `<div class="check checkMax" style="width:100%;height:40px; background-color:red;color:white; border-radius:10px; margin-top: 5px; font-size: 20px; padding: 5px; box-sizing: border-box; position:relative; top: 270px;"><strong>Максимальное кол-во сохраненных репозиториев!</strong></div>`)
        return;
    }
    arr.forEach((item) => {
        if (item.id == id) {
            let addSave = document.createElement('div');
            addSave.insertAdjacentHTML('afterbegin',`Name: ${item.name}<br>Owner: ${item.owner}<br>Stars: ${item.stars}`);
            addSave.style = `width:100%; height:90px; font-size: 20px; padding: 2px;  list-style-type: none; border: solid; background-color: #E27BEB; user-select:none; margin-bottom: 5px; display:flex; box-sizing: border-box; font-size: 24px`;
            let btnClose = document.createElement('div');
            btnClose.classList.add('closeBtn');
            btnClose.style = `margin-left: auto; margin-right: 20px; width: 80px; display:flex;justify-content:center; align-items: center;`; 
            btnClose.insertAdjacentHTML('afterbegin', `<div style="width: 5px; height: 70px; background-color: #FF0000; transform: rotate(45deg); border-radius: 10px"></div>`);
            btnClose.insertAdjacentHTML('afterbegin', `<div style="width: 5px; height: 70px; background-color: #FF0000; transform: rotate(-45deg); border-radius: 10px; position:relative;left:4px;"></div>`);
            btnClose.addEventListener('click', (e) => {
                let target = e.target.closest('.closeBtn');
                let checkMax = document.querySelector('.checkMax');
                target.parentNode.remove();
                if (checkMax) {checkMax.remove()}
                GLOBAL_Max_add++; 
            },{capture: true})
            addSave.appendChild(btnClose);   
            blockSave.insertAdjacentElement('beforeend', addSave)
            GLOBAL_Max_add--;
        }
    })
}
blockInput.addEventListener('click', addFunck)

input.addEventListener('input', debounce(zapros, 500))

