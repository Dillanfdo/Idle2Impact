// apiFunctions.ts
import { apiClient, handleApiError } from './apiClient';

// API endpoints
export const api_endpoints = {
  VALIDATE_USER: '/api/Users/ValidateUser',
  GET_POSTS: '/api/Mentor/GetPost',
  ADD_POST: '/api/Mentor/AddPost', 
  BLOG_POST: '/api/Blog/AddBlog',
  GET_BLOG_POST: '/api/Blog/GetBlogs',
  GET_ALL_BLOG_POST: '/api/Blog/GetAllBlogs',  
  GET_BLOG_COMMENTS: '/api/Blog/GetCommentsByBlogId',
  ADD_BLOG_COMMENTS: '/api/Blog/AddComment',
    
  SEARCH_BLOG_POST: '/api/Blog/SearchBlogs',// Modify this according to your API
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

export const addBlog = async (formData: any) => {
  try {
    debugger;
    const response = await apiClient.post(api_endpoints.BLOG_POST, formData, {
      headers: {
        'Content-Type': 'application/json', // Set content type to JSON
      }
    });
    return response.data;
  } catch (error: any) {
    throw handleApiError(error);
  }
};


export const getAllBlog = async () => {
  try {
    debugger;
    const url = `${api_endpoints.GET_ALL_BLOG_POST}`;
    const response = await apiClient.get(url)
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

export const getCommentsByBlogId = async (blogId: number) => {
  try {
    const url = `${api_endpoints.GET_BLOG_COMMENTS}/${blogId}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const addComment = async (commentData: { Content: string; BlogId: number; UserId: number }) => {
  try {
    const response = await apiClient.post(`${api_endpoints.ADD_BLOG_COMMENTS}`, commentData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};