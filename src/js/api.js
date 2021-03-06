const API_KEY = 'e25e680121e89083bb4ba7c0772c65fc';
const BASE_URL_TRENDING = 'https://api.themoviedb.org/3/trending/all/day';
const BASE_URL_SEARCH = 'https://api.themoviedb.org/3/search/movie';
const BASE_URL_MOVIEID = 'https://api.themoviedb.org/3/movie';
const POSTER_URL = 'https://themoviedb.org/t/p/w220_and_h330_face';

import movieCard from '../templates/movieCard.hbs';
import btnPogination from '../templates/btnPagination.hbs';
import refs from './refs';

export default class ApiService {
  #delta = 2;
  constructor(selectControl) {
    this.page = 1;
    this.totalPagas = 0;
    this.movies = [];

    this.searchQuery = '';
    this.watched = [];
    this.queue = [];
    this._watchedFromLocalStorage = [];
    this._queueFromLocalStorage = [];
    this.selectControl = selectControl;
  }

  fetchMovieByID(id_movie) {
    return fetch(`${BASE_URL_MOVIEID}/${id_movie}?api_key=${API_KEY}`).then(
      response => {
        if (response.status === '404') throw new Error();
        response.json();
      },
    );
  }

  movieAdapter({
    poster_path,
    original_title,
    original_name,
    vote_average,
    release_date,
    first_air_date,
  }) {
    return {
      //имена imgSrc, title, rating, releaseDate СВЕРИТЬ с именами в ПРАВИЛЬНОМ шаблоне карточки
      imgSrc: this.generatePosterPath(poster_path),
      title: original_title || original_name,
      rating: vote_average,
      releaseDate: release_date || first_air_date,
    };
  }

  generatePosterPath(imageName) {
    return `${POSTER_URL}${imageName}`;
  }

  fetchSearchMoviesList(query) {
    return fetch(
      `${BASE_URL_SEARCH}?api_key=${API_KEY}&query=${query}&page=${this.page}`,
    )
      .then(responce => responce.json())
      .then(movies => {
        this.totalPagas = movies.total_pages;
        console.log(movies);
        console.log(this.totalPagas);
        return movies;
      });
  }

  fetchPopularMoviesList() {
    return fetch(`${BASE_URL_TRENDING}?api_key=${API_KEY}&page=${this.page}`)
      .then(response => response.json())
      .then(movies => {
        this.totalPagas = movies.total_pages;
        console.log(movies);
        console.log(this.totalPagas);
        return movies;
      });
  }
  // получение массива Видимых страниц / Оставлено до лучших времён
  // pagination(current, last) {
  //   let indexArray = [1];
  //   for (let i = current - this.#delta; i <= current + this.#delta; i++) {
  //     if (i > 1 && i < last) {
  //       indexArray.push(i);
  //     }
  //   }
  //   indexArray.push(last);
  //   console.log(`привет ${indexArray}`);
  //   return indexArray;
  // }

  // сборная солянки
  pagination(current, last) {
    let code = this.addButtonWithIndex(1);

    if (current - this.#delta > 2) code += this.addButtonInput();

    for (let i = current - this.#delta; i <= current + this.#delta; i++) {
      if (i > 1 && i < last) {
        code += this.addButtonWithIndex(i);
      }
    }

    if (current + this.#delta < last - 1) code += this.addButtonInput();

    code += this.addButtonWithIndex(last);

    this.selectControl.innerHTML = code;
  }

  addButtonWithIndex(index) {
    return ` <li class="pagination-controls__item"><button id='pagination_${index}' class='pagination-controls__btn' type='button'>${index}</button></li>`;
  }
  addButtonInput() {
    return ` <li class="pagination-controls__item"><input class="pagination-controls__input" type="number" placeholder="..." /></li>`;
  }

  fetchWatchedMoviesList() {}
  fetchQueueMoviesList() {}
  fetchModalMovie() {}

  loadWatchedMovies() {
    //после вызова функции в this._watchedFromLocalStorage будет массив с localStorage
    const watchedString = localStorage.getItem('watched');
    this._watchedFromLocalStorage = JSON.parse(watchedString);
  }

  loadQueueMovies() {
    //после вызова функции в this._queue будет массив с localStorage
    const queueString = localStorage.getItem('queue');
    this._queueFromLocalStorage = JSON.parse(queueString);
  }
  get watchedFromLocalStorage() {
    //для проверки
    return this._watchedFromLocalStorage;
  }
  get queueFromLocalStorage() {
    //для проверки
    return this._queueFromLocalStorage;
  }

  addWatchedMovies(movieId) {}
  addQueueMovies(movieId) {
    this.queue.push(movieId);
    localStorage.setItem('queue', JSON.stringify(this.queue));
  }

  renderMovieCards(moviesArray) {
    refs.moviesCardsGallery.insertAdjacentHTML(
      'beforeend',
      movieCard(moviesArray),
    );
  }

  renderMovie(movieObj) {}

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  goToPrevPage() {
    if (this.page === 1) {
      return;
    }
    this.page -= 1;
  }

  goToNextPage() {
    if (this.page === this.totalPagas + 1) {
      return;
    }
    this.page += 1;
  }
}
