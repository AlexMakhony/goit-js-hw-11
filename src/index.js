import './css/style.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { galleryMarkup } from './markup';
// import { fetchPictures } from './js/fetchPictures';
const axios = require('axios').default;

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loadMore = document.querySelector('.more');
const input = document.querySelector('input');

const MY_API_KEY = '33691887-ce6385750ae3035ec2d85fa9a';
let pageforBtn = 1;
let valueInput = '';
let totalHitsValue = '';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  close: false,
});



form.addEventListener('submit', onSubmit);

loadMore.addEventListener('click', onClick);

function onSubmit(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  valueInput = e.currentTarget.elements.searchQuery.value.trim();
  if (!loadMore.classList.contains('visually-hidden')) {
    loadMore.classList.add('visually-hidden');
  }
  if (valueInput === '') {
    Notify.failure('Enter a query');
  } else {
    pageforBtn = 1;

    getPicture(valueInput).then(() => {
      if (totalHitsValue > 0) {
        Notify.success(`Hooray! We found ${totalHitsValue} images.`);
      }
      pageforBtn += 1;
      lightbox.refresh();
      input.value = '';
    });
  }
}

async function getPicture(name) {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=${MY_API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageforBtn}`
    );
    if (response.data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    let arr = response.data.hits;
    let lastPage = Math.ceil(response.data.totalHits / 40);
    totalHitsValue = response.data.totalHits;

    makeListCountries(arr);

    if (response.data.total > 40) {
      loadMore.classList.remove('visually-hidden');
    }
    if (pageforBtn === lastPage) {
      if (!loadMore.classList.contains('visually-hidden')) {
        loadMore.classList.add('visually-hidden');
      }
      if (response.data.total <= 40) {
        return;
      }
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.error(error);
  }
}

function makeListCountries(data) {
  const markup = galleryMarkup(data);
  gallery.insertAdjacentHTML('beforeend', markup);
}

function onClick(e) {
  e.preventDefault();
  getPicture(valueInput).then(() => {
    pageforBtn += 1;
    lightbox.refresh();
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
}