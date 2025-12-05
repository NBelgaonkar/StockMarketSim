/**
 * Authentication API
 * 
 * This module handles all authentication-related API calls.
 * Currently mocked - will connect to Django REST endpoints later.
 * 
 * Django Endpoints (future):
 * - POST /api/auth/register/
 * - POST /api/auth/login/
 * - POST /api/auth/logout/
 * - GET /api/auth/me/
 */

import { mockRequest } from './client';
import { initializeUserPortfolio, loadUserPortfolio, clearUserPortfolio } from './portfolio';

// Mock user database (persisted in localStorage)
const getUsersFromStorage = () => {
  const saved = localStorage.getItem('mockUsers');
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
};

const saveUsersToStorage = (users) => {
  localStorage.setItem('mockUsers', JSON.stringify(users));
};

// Mock session storage
let currentSession = null;

/**
 * Register a new user
 * 
 * Future Django endpoint: POST /api/auth/register/
 * 
 * New users start with:
 * - $0 cash balance
 * - No holdings
 * - No transactions
 * 
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User's email
 * @param {string} userData.username - User's username
 * @param {string} userData.password - User's password
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * 
 * @returns {Promise<{data: {user: Object, token: string}}>}
 * 
 * Used in: src/pages/Register.jsx
 */
export const registerUser = async ({ email, username, password, firstName, lastName }) => {
  const mockUsers = getUsersFromStorage();
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email || u.username === username);
  if (existingUser) {
    throw new Error('User with this email or username already exists');
  }

  const newUser = {
    id: Date.now(),
    email,
    username,
    firstName,
    lastName,
    createdAt: new Date().toISOString(),
  };

  mockUsers.push(newUser);
  saveUsersToStorage(mockUsers);

  const mockToken = `mock-token-${newUser.id}-${Date.now()}`;
  currentSession = { user: newUser, token: mockToken };

  // Initialize empty portfolio for new user (starts with $0)
  initializeUserPortfolio(newUser.id);

  return mockRequest({
    user: newUser,
    token: mockToken,
  });
};

/**
 * Login an existing user
 * 
 * Future Django endpoint: POST /api/auth/login/
 * 
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * 
 * @returns {Promise<{data: {user: Object, token: string}}>}
 * 
 * Used in: src/pages/Login.jsx, src/hooks/useAuth.js
 */
export const loginUser = async ({ email, password }) => {
  const mockUsers = getUsersFromStorage();
  
  // Find existing user
  let user = mockUsers.find(u => u.email === email);
  
  if (!user) {
    // For demo purposes, create a new user if not found
    // In production, this would return an error
    user = {
      id: Date.now(),
      email,
      username: email.split('@')[0],
      firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      lastName: 'User',
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(user);
    saveUsersToStorage(mockUsers);
    
    // Initialize empty portfolio for new user
    initializeUserPortfolio(user.id);
  } else {
    // Load existing portfolio
    loadUserPortfolio(user.id);
  }

  const mockToken = `mock-token-${user.id}-${Date.now()}`;
  currentSession = { user, token: mockToken };

  return mockRequest({
    user,
    token: mockToken,
  });
};

/**
 * Logout the current user
 * 
 * Future Django endpoint: POST /api/auth/logout/
 * 
 * @returns {Promise<{data: {success: boolean}}>}
 * 
 * Used in: src/context/UserContext.jsx, src/components/Navbar.jsx
 */
export const logoutUser = async () => {
  currentSession = null;
  clearUserPortfolio();
  return mockRequest({ success: true });
};

/**
 * Get the current authenticated user
 * 
 * Future Django endpoint: GET /api/auth/me/
 * 
 * @returns {Promise<{data: {user: Object}}>}
 * 
 * Used in: src/context/UserContext.jsx, src/hooks/useAuth.js
 */
export const getCurrentUser = async () => {
  if (!currentSession) {
    throw new Error('Not authenticated');
  }
  return mockRequest({ user: currentSession.user });
};

/**
 * Update user profile
 * 
 * Future Django endpoint: PATCH /api/auth/me/
 * 
 * @param {Object} updates - Fields to update
 * @returns {Promise<{data: {user: Object}}>}
 * 
 * Used in: src/pages/Profile.jsx (future)
 */
export const updateProfile = async (updates) => {
  if (!currentSession) {
    throw new Error('Not authenticated');
  }
  
  currentSession.user = { ...currentSession.user, ...updates };
  
  // Update in storage
  const mockUsers = getUsersFromStorage();
  const userIndex = mockUsers.findIndex(u => u.id === currentSession.user.id);
  if (userIndex >= 0) {
    mockUsers[userIndex] = currentSession.user;
    saveUsersToStorage(mockUsers);
  }
  
  return mockRequest({ user: currentSession.user });
};

/**
 * Restore session from localStorage (called on app init)
 */
export const restoreSession = (savedUser) => {
  if (savedUser) {
    currentSession = { user: savedUser, token: `restored-token-${savedUser.id}` };
    loadUserPortfolio(savedUser.id);
  }
};
