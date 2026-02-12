import { findUserByEmail, createUser, getAllUsers } from '../src/lib/users';

describe('users util', () => {
  test('findUserByEmail returns a user for known test email', () => {
    const user = findUserByEmail('test@example.com');
    expect(user).not.toBeNull();
    if (user) expect(user.email).toBe('test@example.com');
  });

  test('createUser adds a user and can be retrieved', () => {
    const before = getAllUsers().length;
    const newUser = createUser({ name: 'New', email: 'new@example.com', password: 'pwd', phone: '123', created_at: new Date(), role: 'user' });
    expect(newUser._id).toBeTruthy();
    const after = getAllUsers().length;
    expect(after).toBeGreaterThanOrEqual(before + 1);
    const fetched = findUserByEmail('new@example.com');
    expect(fetched).not.toBeNull();
  });
});
