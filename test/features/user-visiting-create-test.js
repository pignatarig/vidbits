const {assert} = require('chai');
const {buildVideoObject} = require('../test-utils');

describe('visit create video', () => {
  describe('visit landing page and click the create link', () => {
    it('click the create link', () => {
      browser.url('/');
      browser.click('a[href="/videos/create"]');
      assert.include(browser.getText('body'), 'Save a video');
      assert.equal(browser.getAttribute('form', 'action'), 'http://localhost:8001/videos');
      assert.equal(browser.getAttribute('form', 'method'), 'post');
    });
  });
  
  describe('create a new video', () => {
    it('visit create page and post video', () => {
      const videoToCreate = buildVideoObject();
      browser.url('/videos/create');
      browser.setValue('#title', videoToCreate.title);
      browser.setValue('#description', videoToCreate.description);
      browser.setValue('#url', videoToCreate.url);
      browser.click('#submit')
      
      assert.include(browser.getText('body'), videoToCreate.title);
      
    });
  });
});
