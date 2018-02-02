const Video = require('../../models/video');
const {assert} = require('chai');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Model: Video', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);
  
  describe('title', () => {
    it('title should be a string', async () => {
      const titulo = 1;
      
      const video = new Video({title: titulo});
      
      assert.strictEqual(video.title, titulo.toString());
    });
    
    it('title is required', async () => {
      const video = new Video({});
      const videoValidated = video.validateSync();
      assert.equal(videoValidated.errors.title.message, 'Path `title` is required.');
    });
  });
  
  describe('description', () => {
    it('description should be a string', async () => {
      const description = 2;
      
      const video = new Video({description: description});
      
      assert.strictEqual(video.description, description.toString());
    })
  })
  
  describe('URL', () => {
    it('should be a string', async () => {
      const url = 1;
      
      const video = new Video({url: url});
      
      assert.strictEqual(video.url, url.toString());
    });
    
    it('is required', async () => {
      const video = new Video({});
      const videoValidated = video.validateSync();
      assert.equal(videoValidated.errors.url.message, 'a URL is required.');
    });
  });
});