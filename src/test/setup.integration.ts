import '@testing-library/jest-dom';

// Polyfill para HTMLDialogElement en jsdom (jsdom no implementa la API nativa de <dialog>)
HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
  this.removeAttribute('open');
};
