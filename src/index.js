import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;

refs.input.addEventListener(
  'input',
  debounce(evt => {
    const inputTrimmedValue = refs.input.value.trim();
    clearData();
    if (inputTrimmedValue !== '') {
      fetchCountries(inputTrimmedValue).then(countries => {
        if (countries.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (countries.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        } else if (countries.length >= 2 && countries.length <= 10) {
          renderCountryList(countries);
        } else if (countries.length === 1) {
          renderOneCountry(countries);
        }
      });
    }
  }, DEBOUNCE_DELAY)
);

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `
          <li>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" height="15" >
         ${country.name.official}
                </li>
      `;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function renderOneCountry(countries) {
  const markup = countries
    .map(country => {
      return `
          <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="40" height="20">
         <b class="name-font">${country.name.official}</b>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)}</p>
                
      `;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
}

function clearData() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
