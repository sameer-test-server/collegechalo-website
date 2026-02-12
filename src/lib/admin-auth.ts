import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AdminTokenPayload {
  userId: string;
  email: string;
  name: string;
  role: 'admin';
}

export function signAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAdminToken(token?: string): AdminTokenPayload | null {
  if (!token) return null;

  try {
    let raw = token;
    if (raw.startsWith('Bearer ')) raw = raw.slice(7);
    const decoded = jwt.verify(raw, JWT_SECRET) as Partial<AdminTokenPayload>;

    if (decoded.role !== 'admin' || !decoded.userId || !decoded.email || !decoded.name) {
      return null;
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: 'admin',
    };
  } catch (err) {
    return null;
  }
}

