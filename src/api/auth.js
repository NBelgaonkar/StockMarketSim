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
let currentSession = { user: null, token: null };

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
  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/users/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        username,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response);
    }
    const result = await response.json();
    console.log('Registered user:', result);

    const newUser = {
      id: result.user.id,
      email: result.user.email,
      username: result.user.username,
      firstName: result.user.first_name,
      lastName: result.user.last_name,
      createdAt: new Date().toISOString(),
    };

    currentSession = { user: newUser, token: result.token };

    return { data: {user: newUser, token: result.token} };
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
  
  /*
  mockUsers.push(newUser);
  saveUsersToStorage(mockUsers);

  const mockToken = `mock-token-${newUser.id}-${Date.now()}`;
  currentSession = { user: newUser, token: mockToken };

  // Initialize empty portfolio for new user (starts with $0)
  initializeUserPortfolio(newUser.id);
  */
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
  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/login/access-token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: email,
        password: password,
        scope: '',
        client_id: 'string',
        client_secret: '',
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.json());
    }
    const tokenData = await response.json();
    console.log('Logged in user:', tokenData);

    const token = tokenData.access_token;

    // Update token in current session
    currentSession.token = token;

    // Fetch current user info
    const currentUserResponse = await getCurrentUser();
    currentSession.user = currentUserResponse.data.user;

    return { data: currentSession };
    
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
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

  const token = currentSession.token;
  
  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/users/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const result = await response.json();
    console.log('Current user:', result);

    const currentUser = {
      id: result.id,
      email: result.email,
      username: result.username,
      firstName: result.first_name,
      lastName: result.last_name,
      createdAt: new Date().toISOString(),
    };

    currentSession.user = currentUser;

    return { data: { user: currentUser } };
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    throw error;
  }
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
