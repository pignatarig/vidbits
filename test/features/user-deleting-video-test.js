const {assert} = require('chai');
const {buildVideoObject, fillForm} = require('../test-utils');

describe('delete video', () => {
  describe('delete video', () => {
    it('visit and delete video', () => {
      const videoToCreate = buildVideoObject();
      browser.url('/videos/create');
      
      fillForm(browser, videoToCreate);
      
      browser.click('#delete');
      
      browser.url('/');
      
      assert.notInclude(browser.getText('body'), videoToCreate.title);
      
    });    
  });
});
