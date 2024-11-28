// apiClient.ts
import axios from 'axios';

// Create a reusable axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:5036', // Base URL for all API requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to handle errors in a centralized way
const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with a status other than 2xx
    return new Error(error.response.data.message || 'Something went wrong');
  } else if (error.request) {
    // No response was received
    return new Error('No response received from server');
  } else {
    // Other errors (configuration or network-related)
    return new Error(error.message || 'An unexpected error occurred');
  }
};

export { apiClient, handleApiError };
