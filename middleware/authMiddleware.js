const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, 'net ninja secret', (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        return res.status(403).json({ error: 'Invalid token' });
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    return res.status(401).json({ error: 'Authentication token required' });
  }
};

module.exports = { requireAuth };