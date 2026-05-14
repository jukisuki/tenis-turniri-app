import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Niste prijavljeni' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Nevažeći token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.uloga !== 'ADMIN') return res.status(403).json({ error: 'Samo za administratore' });
  next();
};
