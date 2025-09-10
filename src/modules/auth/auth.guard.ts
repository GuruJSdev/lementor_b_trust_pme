// auth.guard.ts
import jwt from 'jsonwebtoken';

export function authGuard(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token manquant' });

  try {
    const payload = jwt.verify(token,"fdcc0eef-9dfd-45c9-9370-d0ca615b05fb");
    req.user = payload;
    next();
  } catch(er) {
    console.log("error =>",er);
    res.status(401).json({ error: 'Token invalide' });
  }
}
