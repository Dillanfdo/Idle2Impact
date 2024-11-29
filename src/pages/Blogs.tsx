import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom'; // Import the hook
import { getAllBlog } from '../apis/apiFunctions';

interface BlogPost {
    BlogId: number;        // Corresponds to the 'BlogId' field
    Title: string;         // Corresponds to the 'Title' field
    Author: string;        // Corresponds to the 'Author' field
    PublishedDate: string; // Corresponds to the 'PublishedDate' field
    Content: string;       // Corresponds to the 'Content' field
    Image: string;         // Corresponds to the 'Image' field
    Tags: string | null;   // Corresponds to the 'Tags' field (could be null)
    UserId: number;        // Corresponds to the 'UserId' field
  }
  
const BlogPage: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [postData, setPostData] = useState<BlogPost[]>([]);  // All posts
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]); // Filtered posts

  // Fetch blog posts on page load
  useEffect(() => {
    const fetchPosts = async () => {
      try {
       
        const result = await getAllBlog();
        debugger;
        console.log("Fetched result:", result);
  
        if (result.status === 1) {
          // Parse result.data first, then access the 'Table' property
          const blogData = JSON.parse(result.data);  // Now it's an object
          setPostData(blogData);
          setFilteredPosts(blogData); // Initially, set filtered posts to all posts
        } else {
          setPostData([]);
          setFilteredPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPostData([]);
        setFilteredPosts([]);
      }
    };
    fetchPosts();
  }, []);
  

  // Handle "Add New Blog" button click
  const handleAddNewBlog = () => {
    navigate('/new-blog'); // Use navigate to redirect to NewBlog page
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    filterPosts(event.target.value);
  };

  // Filter blog posts based on search query
  const filterPosts = (query: string) => {
    if (query) {
      const filtered = postData.filter((post) =>
        post.Title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(postData);  // Reset to all posts if search is cleared
    }
  };

  // Navigate to blog detail page
  const handleViewDetails = (postId: number) => {
    navigate(`/blogdetail/${postId}`); // Redirect to the specific blog post page
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Blog
      </Typography>

      {/* Search Box, Search Button, Add New Blog Button */}
      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          label="Search Blog"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={() => filterPosts(searchQuery)}>
          Search
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={handleAddNewBlog} // Call to handle the add new blog
        >
          Add New Blog
        </Button>
      </Stack>

      {/* Displaying Blogs */}
      {filteredPosts.length === 0 ? (
        <Typography>No blog posts found</Typography>
      ) : (
        <Stack spacing={3}>
          {filteredPosts.map((post) => (
           
            <Box key={post.UserId} sx={{ border: '1px solid #ccc', p: 2, borderRadius: 2 }}>
              <Typography variant="h6">{post.Title}</Typography>
              <Typography variant="body2" color="text.secondary">
                By {post.Author} | {new Date(post.PublishedDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">{post.Content}</Typography>

              {/* View Details Button */}
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => handleViewDetails(post.UserId)} // Redirect to the detail page
              >
                View Details
              </Button>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default BlogPage;
