var blog = require('blog.controller.js');

module.exports = function(app) {
  app.get('/api/blogs', blog.get);
  app.post('/api/blog', blog.post);
  app.put('/api/blog/:id', blog.update)
  app.delete('/api/blog/:id', blog.delete);
}
