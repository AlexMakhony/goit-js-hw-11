import './css/style.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { galleryMarkup } from './markup';
import OnlyScroll from 'only-scrollbar';
const axios = require('axios').default;

// Ищем наши элементы
const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.more');
const input = document.querySelector('input');

// Ключ
const MY_API_KEY = '33691887-ce6385750ae3035ec2d85fa9a';
// Линк
const LINK = 'https://pixabay.com/api/?';

let pageforBtn = 1;
let valueInput = '';
let totalHitsValue = '';

// Only-scroll bar
const scroll = new OnlyScroll(document.scrollingElement, {
  damping: 0.8,
  eventContainer: window,
});

// light box
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  close: false,
});


// Слушаем кнопки
form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onClick);

// Функция для формы при сабмите
function onSubmit(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  // Забираем инфо из поисковика
  valueInput = e.currentTarget.elements.searchQuery.value.trim();
  if (!loadMoreBtn.classList.contains('visually-hidden')) {
    loadMoreBtn.classList.add('visually-hidden');
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

// Стучимся в АПИшку
async function getPicture(name) {
  try {
    const response = await axios.get(
      `${LINK}key=${MY_API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageforBtn}`
    );
    if (response.data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    let arr = response.data.hits;
    let lastPage = Math.ceil(response.data.totalHits / 40);
    totalHitsValue = response.data.totalHits;

    makePictureList(arr);

    // Даем условия нашей кнопке "Загрузить еще"
    if (response.data.total > 40) {
      loadMoreBtn.classList.remove('visually-hidden');
    }
    if (pageforBtn === lastPage) {
      if (!loadMoreBtn.classList.contains('visually-hidden')) {
        loadMoreBtn.classList.add('visually-hidden');
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

// Добавляем разметочку из импорта
function makePictureList(data) {
  const markup = galleryMarkup(data);
  gallery.insertAdjacentHTML('beforeend', markup);
}

// Функция нашей кнопке
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