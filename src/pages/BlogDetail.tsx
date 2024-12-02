import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Stack, TextField } from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getCommentsByBlogId, addComment } from '../apis/apiFunctions'; // Assuming you have this function to fetch comments
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
  Comments: Comment[];
}

interface Comment {
  CommentId: number;
  BlogId: number;
  Content: string;
  Name: string;
  UserId: number;
  CreatedDate: string;
}

const BlogDetail: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { state } = useLocation(); // Get the state passed from BlogPage
  const [post, setPost] = useState<BlogPost | null>(state?.postData ?? null); // Get the post data passed from BlogPage
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (post) {
      const fetchComments = async () => {
        try {
          const commentsResult = await getCommentsByBlogId(post.BlogId);
          if (commentsResult.status === 1) {
            const commentData = JSON.parse(commentsResult.data);
            setComments(commentData);
          } else {
            setComments([]);
          }
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };
      fetchComments();
    }
  }, [post]);

  const handleGoBack = () => {
    navigate('/blogs');
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      const commentData = {
        Content: newComment,
        BlogId: post?.BlogId ?? 0,
        UserId: user?.user_id ?? 0,
      };
      const result = await addComment(commentData);
      if (result.status === 1) {
        const updatedComments = await getCommentsByBlogId(post?.BlogId!);
        if (updatedComments.status === 1) {
          const commentData = JSON.parse(updatedComments.data);
          setComments(commentData);
        }
        setNewComment('');
      } else {
        console.error('Error submitting comment:', result);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post) {
    return <Typography>Loading...</Typography>;
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
        <pre>{post.Content}</pre>
      </Typography>

      {post.Image && (
        <Box sx={{ mt: 2 }}>
          <img src={post.Image} alt="Blog Post" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
        </Box>
      )}

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
