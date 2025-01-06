const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request object
    next(); // Move to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: 'Invalid token',decoded });

  }
};

module.exports = { checkAuth };
