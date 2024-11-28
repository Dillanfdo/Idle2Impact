import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom'; // Import the hook

interface BlogPost {
  id: number;
  title: string;
  author: string;
  publishedDate: string;
  content: string;
  image: string;
  comments: string[];
}

const BlogPage: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: 'Understanding React with TypeScript',
      author: 'John Doe',
      publishedDate: '2024-11-28',
      content: 'In this blog post, we will explore how to integrate TypeScript with React...',
      image: 'https://via.placeholder.com/800x400.png?text=React+with+TS',
      comments: ['Great post!', 'Very helpful, thank you!'],
    },
    {
      id: 2,
      title: 'Building a Blog with React',
      author: 'Jane Smith',
      publishedDate: '2024-11-25',
      content: 'Building a blog with React is easy and fun. In this post, we will walk through the steps...',
      image: 'https://via.placeholder.com/800x400.png?text=Blog+with+React',
      comments: ['I love this tutorial!', 'Looking forward to the next post.'],
    },
  ]);

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
    const filtered = blogPosts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
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
            <Box key={post.id}>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                By {post.author} | {new Date(post.publishedDate).toLocaleDateString()}
              </Typography>
              <Typography variant="body1">{post.content}</Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default BlogPage;
