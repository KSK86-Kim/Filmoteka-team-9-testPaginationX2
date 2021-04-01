const refs = {
  searchInput: document.querySelector('.search-input'),
  // searchBtn: document.querySelector('search-button'),
  moviesCardsGallery: document.querySelector('.movie__list'),
  movieInfoModal: document.querySelector('.modal-movie'),
  loadWatchedBtn: document.querySelector('[data-modal-watched]'),
  loadQueueBtn: document.querySelector('[data-modal-queue]'),
  addWatchedBtn: document.querySelector('[data-add-watched]'),
  addQueueBtn: document.querySelector('[data-add-queue]'),
  btnNextPagination: document.querySelector('#next-pagination'),
  btnPrevPagination: document.querySelector('#prev-pagination'),
  paginationControls: document.querySelector('.pagination-controls__list'),
};
export default refs;
