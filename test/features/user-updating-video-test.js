const {assert} = require('chai');
const {buildVideoObject, fillForm} = require('../test-utils');

describe('visit update video', () => {
  describe('update an existing video', () => {
    it('visit and update video', () => {
      const videoToCreate = buildVideoObject();
      
      browser.url('/videos/create');
      fillForm(browser, videoToCreate); 
           
      browser.click('#edit');
      
      const videoToUpdate = buildVideoObject({title: 'nuevo', description: 'nueva descripción'});
      
      fillForm(browser, videoToUpdate); 
      
      assert.include(browser.getText('body'), videoToUpdate.title);
      
    });
    
    it('checks if user updating video does not create an additional video', () => {
      const videoToCreate = buildVideoObject();
      browser.url('/videos/create');
      fillForm(browser, videoToCreate); 
      
      browser.click('#edit');
      
      const videoToUpdate = buildVideoObject({title: 'nuevo', description: 'nueva descripción'});
      
      fillForm(browser, videoToUpdate); 
      
      browser.url('/');
      
      assert.notInclude(browser.getText('body'), videoToCreate.title);
    })
  });
});
