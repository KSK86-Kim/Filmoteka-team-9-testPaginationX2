import './main.scss';
import refs from './js/refs'; /* ждём, пока у нас появятся все нужные имена классов для querySelector */
import ApiService from './js/api';
const debounce = require('lodash.debounce');
import { pluginError } from './js/pluginOn';

const Api = new ApiService(refs.paginationControls);

window.addEventListener('load', loadPage);

refs.btnPrevPagination.addEventListener('click', () => {
  Api.goToPrevPage();
  if (!Api.searchQuery) {
    return fetchPopularMoviesListTEST();
  }
  // console.log(refs.searchInput.value);
  onSearchTEST();
});
refs.btnNextPagination.addEventListener('click', () => {
  Api.goToNextPage();
  if (!Api.searchQuery) {
    return fetchPopularMoviesListTEST();
  }
  onSearchTEST(), console.log(Api.page);
});
refs.paginationControls.addEventListener('click', event => {
  if (event.target.nodeName === 'BUTTON') {
    const a = Number(event.target.textContent);
    if (!Api.searchQuery) {
      return goToPage(a);
    }
    goToPageOnSearch(a), console.log(Api.page);
  }
  if (event.target.nodeName === 'INPUT') {
    const a = Number(event.target.value);
    if (!Api.searchQuery) {
      return goToPage(a);
    }
    goToPageOnSearch(a), console.log(Api.page);
  }
});

// console.log(refs.btnNextPagination, refs.btnPrevPagination);
//Функция проверки текущей страницы
function loadPage() {
  const currentPage = document.getElementsByTagName('html')[0];
  if (currentPage.classList.contains('main-page')) {
    fetchPopularMoviesList();
    refs.searchInput.addEventListener('input', debounce(onSearch, 500));
  }
  if (currentPage.classList.contains('library-page')) {
    refs.loadWatchedBtn.addEventListener('click', loadWatched);
    refs.loadQueueBtn.addEventListener('click', loadQueue);
    loadWatched(); //по умолчанию, отрисовываются просмотренные фильмы
  }
}
//Функция запроса популярных фильмов и отрисовка галлереи карточек - запускается при загрузке главной страницы
function fetchPopularMoviesList() {
  clear();
  Api.resetPage();
  Api.fetchPopularMoviesList().then(movies => movieAdaptedandRender(movies));
  Api.pagination(Api.page, Api.totalPagas);
  // currentBtnPagination();
}

function fetchPopularMoviesListTEST() {
  clear();
  Api.fetchPopularMoviesList().then(movies => movieAdaptedandRender(movies));
  Api.pagination(Api.page, Api.totalPagas);
  // currentBtnPagination();
}
//Функция поиска фильмов по слову - запускается по вводу в инпуте
function onSearch(event) {
  event.preventDefault();
  clear();
  Api.resetPage();
  Api.searchQuery = event.target.value;
  console.log('Api.searchQuery:', Api.searchQuery); //что ищем???
  if (!Api.searchQuery) {
    return fetchPopularMoviesList();
  }
  Api.fetchSearchMoviesList(Api.searchQuery).then(movies => {
    movieAdaptedandRender(movies);
    Api.pagination(Api.page, Api.totalPagas);
    // currentBtnPagination();
    if (!movies.total_results) {
      return pluginError();
    }
  });
}
function onSearchTEST() {
  clear();
  Api.searchQuery = refs.searchInput.value;
  console.log('Api.searchQuery:', Api.searchQuery); //что ищем???
  Api.fetchSearchMoviesList(Api.searchQuery).then(movies => {
    movieAdaptedandRender(movies);
    Api.pagination(Api.page, Api.totalPagas);
    // currentBtnPagination();
    if (!movies.total_results) {
      return pluginError();
    }
  });
}

//Функция очистки галлереи фильмов
function clear() {
  refs.moviesCardsGallery.innerHTML = '';
}
//Функция адаптации пути img и отрисовка
function movieAdaptedandRender(movies) {
  console.log(movies.results);
  const moviesArray = movies.results.map(movie => Api.movieAdapter(movie));
  return Api.renderMovieCards(moviesArray);
}

//Функция отрисовывает просмотренные фильмы пользователя
function loadWatched() {
  clear();
  Api.resetPage();
  refs.loadWatchedBtn.classList.add('active-btn');
  refs.loadQueueBtn.classList.remove('active-btn');
  console.log('отрисовать просмотренные фильмы');
  Api.fetchWatchedMoviesList().then(movies => movieAdaptedandRender(movies));
}
//Функция отрисовывает фильмы добавленные в очередь пользователя
function loadQueue() {
  clear();
  Api.resetPage();
  refs.loadWatchedBtn.classList.remove('active-btn');
  refs.loadQueueBtn.classList.add('active-btn');
  console.log('отрисовать фильмы добавленные в очередь пользователя');
  Api.fetchQueueMoviesList().then(movies => movieAdaptedandRender(movies));
}

function goToPage(index) {
  if (index < 1 || index >= Api.totalPagas) {
    return;
  }
  Api.page = index;
  fetchPopularMoviesListTEST();
}
function goToPageOnSearch(index) {
  if (index < 1 || index >= Api.totalPagas) {
    return;
  }
  Api.page = index;
  onSearchTEST();
}
// function currentBtnPagination() {
//   a = document.querySelector(`"#pagination_${Api.page}"`);
//   a.classList.add('active');
// }
