import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { getAllBlog } from "../apis/apiFunctions";

interface BlogPost {
  BlogId: number;
  Title: string;
  Author: string;
  PublishedDate: string;
  Content: string;
  Image: string;
  Tags: string | null;
  UserId: number;
}

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [postData, setPostData] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await getAllBlog();
        if (result.status === 1) {
          const blogData = JSON.parse(result.data);
          setPostData(blogData);
          setFilteredPosts(blogData);
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

  const handleAddNewBlog = () => {
    navigate("/new-blog");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    filterPosts(event.target.value);
  };

  const filterPosts = (query: string) => {
    if (query) {
      const filtered = postData.filter((post) =>
        post.Title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(postData);
    }
  };

  // Navigate to blog detail page, passing the post data
  const handleViewDetails = (post: BlogPost) => {
    navigate(`/blogdetail/${post.BlogId}`, { state: { postData: post } });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Blog
      </Typography>

      <Stack direction="row" spacing={2} mb={3}>
        <TextField
          label="Search Blog"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
        />
        {/* <Button variant="contained" color="primary" onClick={() => filterPosts(searchQuery)}>
          Search
        </Button> */}
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={handleAddNewBlog}
          sx={{ width: "250px" }}
        >
          Add New Blog
        </Button>
      </Stack>

      {filteredPosts.length === 0 ? (
        <Typography>No blog posts found</Typography>
      ) : (
        <Stack spacing={3}>
          {filteredPosts.map((post) => (
            <Box
              key={post.UserId}
              sx={{ border: "1px solid #ccc", p: 2, borderRadius: 2 }}
            >
              <Typography variant="h6">{post.Title}</Typography>
              <Typography variant="body2" color="text.secondary">
                By {post.Author} |{" "}
                {new Date(post.PublishedDate).toLocaleDateString()}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-wrap", // Preserve line breaks
                  overflow: "hidden", // Hide extra content
                  textOverflow: "ellipsis", // Add "..." at the end
                  display: "-webkit-box", // Enable line clamping
                  WebkitBoxOrient: "vertical", // Vertical box orientation
                  WebkitLineClamp: 3, // Limit to 3 lines
                }}
              >
                {post.Content}
              </Typography>

              {/* View Details Button */}
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => handleViewDetails(post)} // Passing post as state
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
