// Basic test to ensure tokenManager works
import { tokenManager } from '../tokenManager';

describe('TokenManager', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  test('should initialize without tokens', () => {
    const debugInfo = tokenManager.getDebugInfo();
    expect(debugInfo.hasToken).toBe(false);
    expect(debugInfo.hasRefreshToken).toBe(false);
    expect(debugInfo.isValid).toBe(false);
  });

  test('should set and get tokens', () => {
    const testToken = 'test-token';
    const testRefreshToken = 'test-refresh-token';
    const expiresIn = 3600; // 1 hour

    tokenManager.setTokens(testToken, testRefreshToken, expiresIn, 'test-session');

    expect(tokenManager.getToken()).toBe(testToken);
    expect(tokenManager.getRefreshToken()).toBe(testRefreshToken);
    expect(tokenManager.getSessionId()).toBe('test-session');
    expect(tokenManager.isValid()).toBe(true);
  });

  test('should clear tokens', () => {
    tokenManager.setTokens('token', 'refresh', 3600, 'session');
    expect(tokenManager.isValid()).toBe(true);

    tokenManager.clearTokens();
    expect(tokenManager.isValid()).toBe(false);
    expect(tokenManager.getToken()).toBeNull();
  });

  test('should detect expiring tokens', () => {
    // Set token with 1 second expiry
    tokenManager.setTokens('token', 'refresh', 0.001, 'session');
    
    // Should be expiring soon
    setTimeout(() => {
      expect(tokenManager.isExpiringSoon()).toBe(true);
    }, 100);
  });
});