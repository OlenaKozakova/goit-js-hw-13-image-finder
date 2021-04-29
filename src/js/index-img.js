import ImageApiService from './apiService';
import photoCard from '../templates/photoCard.hbs';
import animateScrollTo from 'animated-scroll-to';


const formSearch = document.querySelector('#search-form');
const gridLayout = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('[data-action="load-more"]');
const noResult = document.querySelector('.no-result');

formSearch.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);
gridLayout.addEventListener('click', photoCard);

const imageApiService = new ImageApiService();

async function onSearch(event) {
  event.preventDefault();

  try {
    noResult.classList.add('is-hidden');
    const inputSearchValue = event.currentTarget.elements.query.value;
    imageApiService.query = inputSearchValue;

    loadMoreBtn.classList.add('is-hidden');

    imageApiService.resetPage();
    cleargridLayout();
    const response = await imageApiService.fetchImages();
    if (response.length === 0) {
      noResult.classList.remove('is-hidden');
    } else if (response.length > 0) {
      gridMarkup(response);
      loadMoreBtn.classList.remove('is-hidden');
    }
    if (response.length < 12) {
      loadMoreBtn.classList.add('is-hidden');
    }
  } catch (error) {
  }
}

async function onLoadMore() {
  try {
    const response = await imageApiService.fetchImages();
    gridMarkup(response);
    scrollToElement();
  } catch (error) {

  }
}

function gridMarkup(articles) {
  gridLayout.insertAdjacentHTML('beforeend', photoCard(articles));
}

function cleargridLayout() {
  gridLayout.innerHTML = '';
}

function scrollToElement() {
  const indexToScroll = 12 * (imageApiService.page - 1) - 11;
  const itemToScroll = gridLayout.children[indexToScroll];
  const options = {
    speed: 500,
    verticalOffset: -10,
  };

animateScrollTo(itemToScroll, options);
}
