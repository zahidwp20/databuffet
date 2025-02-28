function wwwRedirect(req, res, next) {
  // Check if the host starts with www
  if (req.headers.host.slice(0, 4) === "www.") {
    // Redirect to the non-www version of the URL
    return res.redirect(301, req.protocol + "://" + req.headers.host.slice(4) + req.originalUrl);
  }

  // Call the next middleware function
  next();
}

module.exports = wwwRedirect;
