// apiFunctions.ts
import { apiClient, handleApiError } from './apiClient';

// API endpoints
export const api_endpoints = {
  VALIDATE_USER: '/api/Users/ValidateUser',
  GET_POSTS: '/api/Mentor/GetPost',
  ADD_POST: '/api/Mentor/AddPost', // Modify this according to your API
};

// Function to validate user login
export const loginUser = async (email: string, password: string) => {
  try {
    const url = `${api_endpoints.VALIDATE_USER}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

// Function to add a post (with form data for file uploads)
export const addPost = async (formData: any) => {
  try {
    debugger;
    const response = await apiClient.post(api_endpoints.ADD_POST, formData, {
      headers: {
        'Content-Type': 'application/json', // Set content type to JSON
      }
    });
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};

export const getposts = async () => {
  try {
    const url = `${api_endpoints.GET_POSTS}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};