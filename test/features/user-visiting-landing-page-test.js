const {assert} = require('chai');
const {buildVideoObject, fillForm} = require('../test-utils');

describe('visit landing page', () => {
  describe('without videos', () => {
    it('there should be no videos', () => {
      browser.url('/');
      assert.equal(browser.getText('#videos-container'), '');
    })
  })
  
  describe('with videos', () => {
    it('there should be videos', () => {
      const videoToCreate = buildVideoObject();
      
      browser.url('/videos/create');
      fillForm(browser, videoToCreate);
      browser.url('/');
            
      assert.include(browser.getText('#videos-container'), videoToCreate.title);
      assert.equal(browser.getAttribute('iframe', 'src'), videoToCreate.url);
    })
    
    it('click the title and navigate to the video', () => {
      const videoToCreate = buildVideoObject();
      
      browser.url('/videos/create');
      fillForm(browser, videoToCreate);
      browser.url('/');

      browser.click('.video-link');
      
      assert.include(browser.getText('.video-title'), videoToCreate.title);
    })
  })
})