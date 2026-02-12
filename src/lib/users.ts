// In-memory user storage for development (fallback when MongoDB is not configured)
// In production, this should use MongoDB

interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  created_at: Date;
  role?: 'admin' | 'user';
}

// In-memory storage - use Node.js global to persist across module reloads
declare global {
  var usersDatabase: Map<string, User>;
}

// Initialize global if not already done
if (!global.usersDatabase) {
  global.usersDatabase = new Map<string, User>();
  // Add test users on first module load
  const testUsers: User[] = [
    {
      _id: 'user_test_001',
      name: 'Test User',
      email: 'test@example.com',
      password: '$2a$10$l1k2EazBsDp6QV1wNYUh7eXV8sUhdS7m4MkCTegmIYMhruxMmHGqW', // bcrypt hash of "password123"
      phone: '+1234567890',
      created_at: new Date(),
      role: 'user',
    },
    {
      _id: 'user_admin_001',
      name: 'Admin',
      email: 'admin@collegechalo.com',
      password: '$2a$10$iLUk06RiSclaYDRlxpepM.tFFhjNMl//OOCS6pFVVU/4Tiw8vi47e', // bcrypt hash of "admin123"
      phone: '+1234567890',
      created_at: new Date(),
      role: 'admin',
    }
  ];
  testUsers.forEach(user => {
    global.usersDatabase.set(user._id!, user);
  });
}

const users = global.usersDatabase;

export function findUserByEmail(email: string): User | null {
  for (const [, user] of users) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

export function createUser(user: Omit<User, '_id'>): User {
  const id = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  const newUser = { ...user, _id: id };
  users.set(id, newUser);
  return newUser;
}

export function getAllUsers(): User[] {
  return Array.from(users.values());
}

// Initialize with admin user
export function initializeAdmin(): void {
  // Only initialize if no users exist yet
  if (users.size === 0) {
    const adminUser: User = {
      _id: 'admin-001',
      name: 'Admin',
      email: 'admin@collegechalo.com',
      password: '$2a$10$iLUk06RiSclaYDRlxpepM.tFFhjNMl//OOCS6pFVVU/4Tiw8vi47e', // bcrypt hash of "admin123"
      phone: '+1234567890',
      created_at: new Date(),
      role: 'admin',
    };
    users.set(adminUser._id!, adminUser);
  }
}
