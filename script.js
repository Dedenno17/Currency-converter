//get data of countries
function getDataCountries() {
    return fetch('https://free.currconv.com/api/v7/countries?apiKey=4598e2417f86bc9f4622')
            .then(response => response.json())
            .then(response => response.results);
}

// getDataCountries();

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
                <p class="currency-input"><span class="currency-symbol">${country.currencySymbol}</span><input placeholder="0.0000"></p>
                <p class="currency-name"> ${country.currencyId} - ${country.currencyName}</p>
                <p class="base-currency-rate">1 USD = 0000 ${country.currencyId}</p>
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

// delete list in currency list
const currencyList = document.querySelector('.currency-list');
currencyList.addEventListener('click', (e) => {
    const parent = e.target.parentElement.parentElement;
    const child = e.target.parentElement;

    parent.removeChild(child);
})

