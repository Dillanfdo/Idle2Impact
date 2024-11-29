import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Stack, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllBlog, getCommentsByBlogId, addComment } from '../apis/apiFunctions'; // Assuming you have this function to fetch posts
import { useUser } from '../contexts/UserContext';

interface BlogPost {
  BlogId: number;
  Title: string;
  Author: string;
  PublishedDate: string;
  Content: string;
  Image: string;
  Tags: string | null;
  UserId: number;
  Comments: Comment[]; // New field to hold comments for this blog post
}

interface Comment {
  CommentId: number;   // ID of the comment
  BlogId: number;      // ID of the blog the comment belongs to
  Content: string;
  Name: string;        // Name of the user posting the comment
  UserId: number;      // ID of the user who posted the comment
  CreatedDate: string; // Timestamp when the comment was created
}

const BlogDetail: React.FC = () => {
  const { user } = useUser();
  const { id } = useParams(); // Use the useParams hook to get the blog post id from the URL
  const navigate = useNavigate(); // Use navigate to redirect users
  const [post, setPost] = useState<BlogPost | null>(null); // State to store the single blog post
  const [comments, setComments] = useState<Comment[]>([]); // State to store the comments for this post
  const [newComment, setNewComment] = useState<string>(''); // State to hold new comment text
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // State to track submitting status

  // Fetch the blog post details based on the ID
  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const result = await getAllBlog();
        if (result.status === 1) {
          const blogData = JSON.parse(result.data);
          const blogPost = blogData.find((post: BlogPost) => post.UserId === parseInt(id!));
          if (blogPost) {
            setPost(blogPost);
            const commentsResult = await getCommentsByBlogId(blogPost.BlogId);
            if (commentsResult.status === 1) {
              const commentData = JSON.parse(commentsResult.data);
              setComments(commentData); // Set the comments from the API
            } else {
              setComments([]); // Handle if no comments are found
            }
          } else {
            console.error('Blog post not found');
          }
        }
      } catch (error) {
        console.error('Error fetching blog post details:', error);
      }
    };

    if (id) {
      fetchBlogDetails();
    }
  }, [id]);

  // Go back to the blog list page
  const handleGoBack = () => {
    navigate('/blogs'); // Go back to the main blog page
  };

  // Handle comment submission
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return; // Avoid submitting empty comments

    setIsSubmitting(true); // Set submitting status to true

    try {
      // Assuming `addComment` sends a POST request to add a comment
      const commentData = {
        Content: newComment,
        BlogId: post?.BlogId ?? 0,  // Fallback to 0 if BlogId is undefined
        UserId: user?.user_id?? 0,  // Fallback to 0 if UserId is undefined
      };
      const result = await addComment(commentData);
      if (result.status === 1) {
        // Refresh the comments after submitting
        const updatedComments = await getCommentsByBlogId(post?.BlogId!);
        if (updatedComments.status === 1) {
          const commentData = JSON.parse(updatedComments.data);
          setComments(commentData); // Update the comment list with the newly added comment
        }
        setNewComment(''); // Clear the comment input after successful submission
      } else {
        console.error('Error submitting comment:', result);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false); // Reset submitting status
    }
  };

  if (!post) {
    return <Typography>Loading...</Typography>; // Show loading message while fetching the post
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4, p: 3 }}>
        <Button
            variant="contained"
            color="secondary"
            onClick={handleGoBack}
            sx={{ mb: 4 }}
          >
            Back to Blog List
          </Button>
      <Typography variant="h4" gutterBottom>
        {post.Title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        By {post.Author} | {new Date(post.PublishedDate).toLocaleDateString()}
      </Typography>
      <Typography variant="body1" paragraph>
        {post.Content}
      </Typography>

      {post.Image && (
        <Box sx={{ mt: 2 }}>
          <img src={post.Image} alt="Blog Post" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
        </Box>
      )}

      {/* Display comments */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        {comments.length === 0 ? (
          <Typography>No comments yet.</Typography>
        ) : (
          <Stack spacing={2}>
            {comments.map((comment) => (
              <Box key={comment.CommentId} sx={{ border: '1px solid #ddd', p: 2, borderRadius: 2 }}>
                <Typography variant="body2">{comment.Content}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Posted by {comment.Name} on {new Date(comment.CreatedDate).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      {/* Add new comment section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add a Comment
        </Typography>
        <TextField
          label="Your Comment"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitComment}
            disabled={isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Comment'}
          </Button>

          
        </Box>
      </Box>
    </Box>
  );
};

export default BlogDetail;
