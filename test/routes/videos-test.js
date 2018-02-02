const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const app = require('../../app');
const Video = require('../../models/video');

const {parseTextFromHTML, buildVideoObject} = require('../test-utils');

describe('landing videos', () => {
  const videoToCreate = buildVideoObject();
  
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);
  
  describe('GET /', () => {
    it('renders all videos', async () => {
      const response = await request(app).post('/videos').type('form').send(videoToCreate);
      
      //const response = await request(app).post('/videos').type('form').send(videoToCreate);
      
      const responseLanding = await request(app).get('/');
      
      assert.include(parseTextFromHTML(responseLanding.text, '#videos-container'), videoToCreate.title);
    });
  });
});

describe('Create Video', () => {
  const videoToCreate = buildVideoObject();
  
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);
  
  describe('GET /videos/create', () => {
    it('renders an empty form', async () => {
      
      const response = await request(app).get('/videos/create');
      
      assert.equal(parseTextFromHTML(response.text, 'input#title'), '');
      assert.equal(parseTextFromHTML(response.text, 'textarea#description'), '');
    });
  });
  
  describe('POST /videos', () => {
    it('should response 302', async () => {      
      const response = await request(app).post('/videos').type('form').send(videoToCreate);
      assert.equal(response.status, 302);
    });
    
    it('should store the video in the DB', async () => {
      const response = await request(app).post('/videos').type('form').send(videoToCreate);
      const video = await Video.findOne(videoToCreate);
      assert.include(video, videoToCreate);
    })
    
    it('post with no title does not save the video', async () => {
      const videoWithoutTitle = {description: 'descripcion'}
      const response = await request(app).post('/videos').type('form').send(videoWithoutTitle);
      
      const videos = await Video.find({});
      assert.equal(videos.length, 0);
    });
    
    it('post with no title gets response status 400', async () => {
      const videoWithoutTitle = {description: 'descripcion'}
      const response = await request(app).post('/videos').type('form').send(videoWithoutTitle);
      
      assert.equal(response.status, 400);
    });
    
    it('post with no title gets redirected to the create form', async () => {
      const videoWithoutTitle = {url: 'URL'}
      const response = await request(app).post('/videos').type('form').send(videoWithoutTitle);
      
      assert.equal(parseTextFromHTML(response.text, 'input#title'), '');
    });
    
    it('post with no title gets error message', async () => {
      const videoWithoutTitle = {description: 'descripcion'}
      const response = await request(app).post('/videos').type('form').send(videoWithoutTitle);
      
      const videos = await Video.find({});
      assert.include(response.text, 'title is required');
    });
    
    it('post with no title preserves the other data on the form', async () => {
      const videoWithoutTitle = {description: 'descripcion'}
      const response = await request(app).post('/videos').type('form').send(videoWithoutTitle);
      
      const videos = await Video.find({});
      assert.include(parseTextFromHTML(response.text, 'textarea#description'), videoWithoutTitle.description);
    });
    
    it('post with no URL does not save the video', async () => {
      const videoWithoutTitle = {title: 'título'}
      const response = await request(app).post('/videos').type('form').send(videoWithoutTitle);
      
      const videos = await Video.find({});
      assert.equal(videos.length, 0);
    });
  })
});

describe('Show video', () => {
  const videoToCreate = buildVideoObject();
  
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);
  
  describe('GET /videos/:id', () => {
    it('renders specific video page', async () => {
      const video = await Video.create(videoToCreate);      
      const response = await request(app).get('/videos/' + video._id);
      assert.include(response.text, videoToCreate.title);
      assert.include(response.text, video.url);
    })
  });
});

describe('Edit video', () => {
  const videoToCreate = buildVideoObject();
  
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);
  
  describe('GET /videos/:id/edit', () => {
    it('renders update video page', async () => {
      const video = await Video.create(videoToCreate);      
      const response = await request(app).get('/videos/' + video._id + '/edit');
      
      assert.equal(parseTextFromHTML(response.text, 'input#title'), '');
      assert.equal(parseTextFromHTML(response.text, 'textarea#description'), videoToCreate.description);
      assert.equal(parseTextFromHTML(response.text, 'input#url'), '');
    });
  });  
  
  describe('POST /videos/:id/updates', () => {
    it('updates the video', async () => {
      const video = await Video.create(videoToCreate);    
      const videoToUpdate = buildVideoObject({title: 'nuevo'})  
      const response = await request(app).post('/videos/' + video._id + '/updates').type('form').send(videoToUpdate);
      const videoUpdated = await Video.findOne(videoToUpdate);
      
      assert.include(videoUpdated, videoToUpdate);
    });
    
    it('should response 302', async () => {
      const video = await Video.create(videoToCreate);    
      const videoToUpdate = buildVideoObject({title: 'nuevo'})  
      const response = await request(app).post('/videos/' + video._id + '/updates').type('form').send(videoToUpdate);
      
      assert.equal(response.status, 302);
    });
    
    it('should not update the video when the input is not valid', async () => {
      const video = await Video.create(videoToCreate);    
      const videoToUpdate = buildVideoObject({title: ''})  
      const response = await request(app).post('/videos/' + video._id + '/updates').type('form').send(videoToUpdate);
      const videoUpdated = await Video.findOne(videoToUpdate);
      
      assert.equal(videoUpdated.title, videoToCreate.title);
    });
    
    it('should respond 400 when the input is not valid', async () => {
      const video = await Video.create(videoToCreate);    
      const videoToUpdate = {}
      const response = await request(app).post('/videos/' + video._id + '/updates').type('form').send(videoToUpdate);
      
      assert.equal(response.status, 400);
    });
  });
  
  describe('POST /videos/:id/deletions', () => {
    it('should delete the video', async () => {
      const video = await Video.create(videoToCreate);    
      const response = await request(app).post('/videos/' + video._id + '/deletions');
      
      const responseLanding = await request(app).get('/');
      assert.notInclude(parseTextFromHTML(responseLanding.text, '#videos-container'), videoToCreate.title);
    });
  });
});