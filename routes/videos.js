const router = require('express').Router();
const Video = require('../models/video');

router.get('/', async (req, res, next) => {
  const videos = await Video.find({});
  res.render('videos/index', {videos: videos});
})

router.get('/videos/create', (req, res, next) => {
  res.render('videos/create');
})

router.get('/videos/:id/edit', async (req, res, next) => {
  const video = await Video.findById(req.params.id)
  res.render('videos/edit', {video: video});
})

router.get('/videos/:id', async (req, res, next) => {
  const video = await Video.findById(req.params.id)
  res.render('videos/show', {video: video})
});

router.post('/videos', async (req, res, next) => {
  const {title, description, url} = req.body;
  const video = new Video({title, description, url});
  video.validateSync();
  if (video.errors) {
    res.status(400).render('videos/create', {video: video, error: 'title is required'});
  } else {
    await video.save();
    res.redirect('/videos/' + video._id);
  }
});

router.post('/videos/:id/updates', async (req, res, next) => {
  const {title, description, url} = req.body;
  const video = await Video.findById(req.params.id);
  video.title = title;
  video.description = description;
  video.url = url;
  
  video.validateSync();
  if (video.errors) {
    res.status(400).render('videos/edit', {video: video, error: video.errors});
  } else {
    await video.save();
    res.redirect('/videos/' + video._id);
  }
});

router.post('/videos/:id/deletions', async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  video.remove().then(function() {
    res.redirect('/');
  }).catch(function (err) {
    res.redirect('/');
  })
});

module.exports = router;