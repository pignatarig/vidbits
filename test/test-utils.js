const {jsdom} = require('jsdom');

const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

const buildVideoObject = (options = {}) => {
  const title = options.title || 'Título';
  const description = options.description || 'Descripción';
  const url = options.url || 'http://youtube.com/embed/${Math.random()}'
  return {title, description, url};
};

const fillForm = (browser, videoToCreate) => {
  browser.setValue('#title', videoToCreate.title);
  browser.setValue('#description', videoToCreate.description);
  browser.setValue('#url', videoToCreate.url);
  browser.click('#submit');
};

module.exports = {
  parseTextFromHTML,
  buildVideoObject,
  fillForm,
};