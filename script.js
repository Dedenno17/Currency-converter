//get data of countries
function getDataCountries() {
    return fetch('https://free.currconv.com/api/v7/countries?apiKey=4598e2417f86bc9f4622')
            .then(response => response.json())
            .then(response => response.results);
}

// get data for currencies
function getDataCurrecies(cur1, cur2) {
    return fetch(`https://free.currconv.com/api/v7/convert?q=${cur1}_${cur2},${cur2}_${cur1}&compact=ultra&date&apiKey=4598e2417f86bc9f4622`)
            .then(response => response.json())
            .then(response => response);
}

// getDataCurrecies('USD', 'IDR');



// function to get flag code
function getFlagCode(country){
    return country.toLowerCase();
}


// make element of currency that doesnt added yet
function makeElCurrencyToAdd(country) {
    return `<li data-currency="${country.id}">
                <img src="https://www.geonames.org/flags/l/${getFlagCode(country.id)}.gif" class="flag" alt="nation-flag">
                <span>${country.currencyId} - ${country.currencyName}</span>
            </li>`;
}

// add element of currency that is not being added yet to it container
function addElCurrencyToAdd(countries) {
    const addCurrencyListContainer = document.querySelector('.add-currency-list');
    let element = '';
    for(let country in countries){
        element += makeElCurrencyToAdd(countries[country]);
    }
    addCurrencyListContainer.innerHTML = element;
}




// make element currency list
function makeElCurrency(country) {
    return `<img src="https://www.geonames.org/flags/l/${getFlagCode(country.id)}.gif" class="flag" alt="nation-flag">
            <div class="info">
                <p class="currency-input"><span class="currency-symbol">${country.currencySymbol}</span><input class="currency-value" placeholder="0.0000"></p>
                <p class="currency-name"><span class="currency-id">${country.currencyId}</span> - ${country.currencyName}</p>
                <p class="base-currency-rate">1 <span class="this-currency">${country.currencyId}</span> = <span class="this-currency-value">0000</span> <span class="base-current-currency">${country.currencyId}</span></p>
            </div>
            <span class="close">&times;</span>`;
}

// add element currency to currency ul
function addCurrency(el, id) {
    const newLi = document.createElement('li');
    newLi.innerHTML = el;
    newLi.setAttribute('id', id);
    newLi.classList.add('currency');

    const currencyContainer = document.querySelector('.currency-list');
    currencyContainer.appendChild(newLi);
}






// event Handler

// show add currency list
const addCurrencyBtn = document.querySelector('.add-currency-btn');
addCurrencyBtn.addEventListener('click', async function() {
    this.classList.add('open');
    const countries = await getDataCountries();
    addElCurrencyToAdd(countries);
});

// hide add currency list
const addCurrencyBtnIcon = document.querySelector('.add-currency-btn i');
addCurrencyBtnIcon.addEventListener('click', (e) => {
    e.target.parentElement.classList.remove('open');
    e.stopPropagation();
});

// add currency of chosen country to list
const addCurrencyListContainer = document.querySelector('.add-currency-list');
addCurrencyListContainer.addEventListener('click', async (e) => {
    const countryCurrencyId = e.target.dataset.currency;
    const countries = await getDataCountries();
    addCurrency(makeElCurrency(countries[countryCurrencyId]), countryCurrencyId);
});

// delete list in currency list & add base currency class
const currencyList = document.querySelector('.currency-list');
currencyList.addEventListener('click', async (e) => {
    
    // delete child
    if( e.target.className == 'close' ){
        const parent = e.target.parentElement.parentElement;
        const child = e.target.parentElement;
    
        parent.removeChild(child);
    }

    // add class base currency
    if( e.target.classList.contains('currency') ){
        const parent = e.target.parentElement;
        for(let child of parent.children){
            if( child.classList.contains('base-currency') ){
                child.classList.remove('base-currency');
            }
            
            // get and show the currency of base currency and current list currency
            child.children[1].lastElementChild.lastElementChild.innerHTML = e.target.children[1].children[1].firstElementChild.textContent;
            const dataCurrencies = await getDataCurrecies(e.target.children[1].children[1].firstElementChild.textContent, child.children[1].children[1].firstElementChild.textContent);
            child.children[1].lastElementChild.children[1].innerHTML = dataCurrencies[`${child.children[1].children[1].firstElementChild.textContent}_${e.target.children[1].children[1].firstElementChild.textContent}`];
            
        }
        e.target.classList.add('base-currency');



    }

    

    // console.log(e.target);
})

currencyList.addEventListener('keydown', async (e) => {
    if( e.target.className == 'currency-value' ){
            // const parent = this.parentElement.parentElement.parentElement;
            const parentLi = e.target.parentElement.parentElement.parentElement.parentElement;
            for( let child of parentLi.children ){
                if( child.classList.contains('base-currency') ){
                    continue;
                }else{   
                    const curr1 = child.children[1].lastElementChild.lastElementChild.textContent;
                    const curr2 = child.children[1].lastElementChild.firstElementChild.textContent;
                    const childValue = child.children[1].firstElementChild.lastElementChild;

                    const dataCurrencies = await getDataCurrecies(curr1, curr2);
                    childValue.value =  dataCurrencies[`${curr1}_${curr2}`] * e.target.value;
                }

            }
            
        }
})

// async function calculateCurr (child, base,cur1, cur2) {
//     const currencies = await getDataCurrecies(cur1, cur2);
//     child.value = currencies[`${cur1}_${cur2}`] * base.value;
// }