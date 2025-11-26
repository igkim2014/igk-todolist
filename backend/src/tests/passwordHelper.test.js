const { hashPassword, comparePassword } = require('../utils/passwordHelper');

describe('Password Helper Tests', () => {
  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const plainPassword = 'testpassword123';

      const hashedPassword = await hashPassword(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(plainPassword);
    });

    it('should throw error if password is not provided', async () => {
      await expect(hashPassword()).rejects.toThrow('Password must be a non-empty string');
      await expect(hashPassword(null)).rejects.toThrow('Password must be a non-empty string');
      await expect(hashPassword(undefined)).rejects.toThrow('Password must be a non-empty string');
    });

    it('should throw error if password is not a string', async () => {
      await expect(hashPassword(123)).rejects.toThrow('Password must be a non-empty string');
      await expect(hashPassword({})).rejects.toThrow('Password must be a non-empty string');
      await expect(hashPassword([])).rejects.toThrow('Password must be a non-empty string');
    });
  });

  describe('comparePassword', () => {
    it('should return true when password matches', async () => {
      const plainPassword = 'testpassword123';
      const hashedPassword = await hashPassword(plainPassword);

      const result = await comparePassword(plainPassword, hashedPassword);

      expect(result).toBe(true);
    });

    it('should return false when password does not match', async () => {
      const plainPassword = 'testpassword123';
      const wrongPassword = 'wrongpassword123';
      const hashedPassword = await hashPassword(plainPassword);

      const result = await comparePassword(wrongPassword, hashedPassword);

      expect(result).toBe(false);
    });

    it('should throw error if plain password is not provided', async () => {
      await expect(comparePassword()).rejects.toThrow('Both plain password and hashed password must be provided');
      await expect(comparePassword(null, 'hash')).rejects.toThrow('Both plain password and hashed password must be provided');
    });

    it('should throw error if hashed password is not provided', async () => {
      await expect(comparePassword('password')).rejects.toThrow('Both plain password and hashed password must be provided');
      await expect(comparePassword('password', null)).rejects.toThrow('Both plain password and hashed password must be provided');
      await expect(comparePassword('password', undefined)).rejects.toThrow('Both plain password and hashed password must be provided');
    });
  });

  describe('Integration Tests', () => {
    it('should hash password and verify it correctly', async () => {
      const plainPassword = 'testpassword123';

      // Hash the password
      const hashedPassword = await hashPassword(plainPassword);

      // Verify the hash was created properly
      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe('string');
      expect(hashedPassword).not.toBe(plainPassword); // Should not be the same

      // Verify that the password matches the hash
      const isMatch = await comparePassword(plainPassword, hashedPassword);
      expect(isMatch).toBe(true);

      // Verify that a wrong password doesn't match
      const isWrongMatch = await comparePassword('wrongpassword', hashedPassword);
      expect(isWrongMatch).toBe(false);
    });

    it('should handle different password formats', async () => {
      const testCases = [
        'simple',
        'complexPassword123!@#',
        '123456789',
        'a'.repeat(50), // Long password
        'p@ssw0rd!',
      ];

      for (const password of testCases) {
        const hashed = await hashPassword(password);
        const isMatch = await comparePassword(password, hashed);
        expect(isMatch).toBe(true);
      }
    });
  });
});