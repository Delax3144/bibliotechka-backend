const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Brak tokena' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Токен должен содержать `id`
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Nieprawidłowy token' });
  }
};

module.exports = authMiddleware;