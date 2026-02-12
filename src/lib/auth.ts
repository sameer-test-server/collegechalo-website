import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function verifyToken(token?: string) {
  if (!token) return null;
  try {
    if (token.startsWith('Bearer ')) token = token.slice(7);
    const payload = jwt.verify(token, JWT_SECRET) as any;
    return { userId: payload.userId, email: payload.email, name: payload.name };
  } catch (err) {
    return null;
  }
}
