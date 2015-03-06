var Blog = require('blog.model.js');

module.exports = {
  get = function(req, res, next) {
    Blog.find(function(err, blogs) {
      if(!err) {
        next(res.status(200).json(blogs));
      }
      else {
        next(res.status(400).json(err));
      }
    });
  },
  insert = function(req, res, next) {

  },
  update = function(req, res, next) {

  },
  delete = function(req, res, next) {

  }
}
