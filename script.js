// код валюты // значение в рублях // разница в процентах в сравнении с предыдущим днем
// вывод в виде списка
// При наведении на элемент списка он должен выделяться и под курсором должно отображаться полное название валюты в tooltip.
// При клике на элемент списка отображается список по данной валюте за 10 дней.
//https://hh.ru/vacancy/53638235?from=vacancy&hhtmFrom=vacancy&hhtmFromLabel=suitable_vacancies
// Залесский Кирилл

// +7 (915) 0101235, Пишите в What's up или Telegram (Ни в коем случае не звонить)

// zalesskyk@gmail.com

let $place = document.querySelector('.workPlace')
let $previous = document.querySelector('.previous') 
const $titlemain = document.querySelector('.titlemain')
const $minititle = document.querySelector('.title')
let array10 = []
let data10 = []
let OBJ = {}


let promise = new Promise(function(resolve,reject) {
    fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    .then((res)=>res.json())
        .then((data) => {
            localStorage.setItem('todaydata', JSON.stringify(data));
            // localStorage.setItem('newdata',JSON.stringify(data))
            console.log('ok 1');
            renderInfoValutes(parseValutes())
            resolve()
        })
})

promise.then(()=>{
    let array = JSON.parse(localStorage.getItem('todaydata'))
    let url = 'https:'
    url+=array.PreviousURL
    previousDays(url)
})

function parseValutes(){ //get array of values
    let array = JSON.parse(localStorage.getItem('todaydata'))
    // let array = localStorage.getItem('todaydata')
    let valute = array.Valute
    let valuteArray = []
    for (key in valute) {
        valuteArray.push(valute[key])
    }
    console.log('aaaaaa',array.PreviousURL);
    localStorage.setItem('yesterday', JSON.stringify(array.PreviousURL));
    localStorage.setItem('today', JSON.stringify(array.Date));
    return valuteArray
}


function renderInfoValutes(valutes){
    let today = JSON.parse(localStorage.getItem('today'))
    $titlemain.textContent = `Валюта (на ${today.substr(0,10)})`
    const listOfValutes = document.createElement('ul')
    listOfValutes.classList.add('list')
    let inner = ''
    valutes.forEach((valute) => {
        const liElement = document.createElement('li')
        liElement.setAttribute('data-tooltip', `${valute.Name}`)
        liElement.setAttribute('id', `${valute.CharCode}`)
        liElement.classList.add('li')
        if (valute.Value>valute.Previous){
            liElement.classList.add('increase')
        } else {
            liElement.classList.add('decrease')
        }
        let persent = (valute.Value-valute.Previous)/valute.Value*100
        let raznica = round10(persent)
        let sigh = trend(valute.Value,valute.Previous)

        liElement.textContent = `${valute.CharCode}  ${valute.Value} (${sigh} ${raznica}%)`
        listOfValutes.append(liElement)
    })
    $place.append(listOfValutes)
}

function parsePrevURL(data){ //get previousdata
    // let array = JSON.parse(data)
    let url = 'https:'
    url+=data.PreviousURL
    return url
}

///////////////////////
let newPrevURL
let perem
function previousDays(prevURL,counter) {

    let prevPromise = new Promise(function(resolve,reject) {
        fetch(`${prevURL}`)
            .then((res)=>res.json())
            .then((data) => {  
                perem = data   
                resolve()
            }
        )
    })

    prevPromise.then(()=>{
        return new Promise(function(resolve,reject) {
                newPrevURL = parsePrevURL(perem)
                array10.push(newPrevURL)
                let valute = perem.Valute
                let day = perem.Date
                let num = {}
                for (key in valute) {
                    num[key] = valute[key]["Value"]
                }
                OBJ[day] = num
                resolve()
        })
    })
    .then(()=>{
        if (array10.length<10) {
                previousDays(newPrevURL,counter++)
        }
        
    })
}


$place.addEventListener('click', (event)=>{
    $previous.innerHTML = ''
    let element = event.target
    console.log(element);
    let previous = []
    let date = []
    if (element.classList.contains('li')){
        
        liID = `${element.id}`
        $minititle.textContent = `Значение ${liID} за последние 10 дней`
        for (key in OBJ) { 
            previous.push(OBJ[key][liID])
            date.push(key.substr(0, 10))
        }
        console.log(previous);
        console.log(date);
        const innerPrev = document.createElement('div')
        for (let index = 0; index < 10; index++) {
            const prevElement = document.createElement('div')
            prevElement.classList.add('forFlex')
            const div1 = document.createElement('div')
            div1.textContent = `${date[index]}`
            const div2 = document.createElement('div')
            div2.textContent = `${previous[index]}`
            prevElement.append(div1,div2)
            
            // prevElement.textContent = `${date[index]}${previous[index]}`
            innerPrev.append(prevElement)
        }
    
        $previous.append(innerPrev)
    }

})









function round10(num){
    return Math.floor(num*100)/100
}

function trend(current, previous) {
    if (current > previous) return '▲';
    if (current < previous) return '▼';
    return '';
}

document.onmouseover = function(event) {
    let target = event.target;

    // если у нас есть подсказка...
    let tooltipHtml = target.dataset.tooltip;
    if (!tooltipHtml) return;

    tooltipElem = document.createElement('div');
    tooltipElem.className = 'tooltip';
    tooltipElem.innerHTML = tooltipHtml;
    document.body.append(tooltipElem);

    // спозиционируем его сверху от аннотируемого элемента (top-center)
    let coords = target.getBoundingClientRect();

    let left = coords.left + (target.offsetWidth - tooltipElem.offsetWidth) / 3;
    if (left < 0) left = 0; // не заезжать за левый край окна

    let top = coords.top - tooltipElem.offsetHeight - 5;
    if (top < 0) { // если подсказка не помещается сверху, то отображать её снизу
        top = coords.top + target.offsetHeight + 5;
    }
    tooltipElem.style.left = left + 'px';
    tooltipElem.style.top = top + 'px';
    };

document.onmouseout = function(e) {
    if (tooltipElem) {
        tooltipElem.remove();
        tooltipElem = null;
    }
};

// try {
    
// } catch (ReferenceError) {
//     console.log('hihi');
// }