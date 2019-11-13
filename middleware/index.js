var middlewareObj = {};


middlewareObj.ensureAuthenticated =  function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
}

module.exports = middlewareObj;