import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  InputAdornment,
  IconButton,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useForm, Controller } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { apiClient, handleApiError } from "../apis/apiClient";
import { addBlog, api_endpoints } from "../apis/apiFunctions";
import { useUser } from "../contexts/UserContext";

interface FormData {
  title: string;
  content: string;
  author: string;
  tags: string[];
  image: File | null;
  publishDate: Dayjs | null;
}

const NewBlog: React.FC = () => {
  const { user } = useUser();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [image, setImage] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prevTags) => [...prevTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prevTags) => prevTags.filter((t) => t !== tag));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage((prev) => [...prev, ...Array.from(event.target.files || [])]);
    }
  };

  const removeImage = (index: number) => {
    setImage((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      alert("User data is not available. Please log in.");
      return;
    }
    const postData = {
      Title: data.title,
      Content: data.content,
      Author: data.author,
      Tags: tags.toString(),
      Image: image ? URL.createObjectURL(image[0]) : null, // for now, displaying locally
      PublishedDate: data.publishDate
        ? data.publishDate.format("YYYY-MM-DD")
        : "",
      UserId: user?.user_id,
    };
    try {
      const result = await addBlog(postData);
      if (result.status == 1) {
        alert("Data submitted successfully!");
        navigate("/blogs");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred while submitting the data.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        // maxWidth: 800,
        mx: "auto",
        mt: 4,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography variant="h5" mb={3}>
          Create a New Blog Post
        </Typography>

        {/* Back Button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/blogs")} // Adjust the path based on where your blog listing page is
          sx={{ mb: 2 }}
        >
          Back to Blog
        </Button>
      </Box>

      <Stack spacing={3}>
        <Box display={"flex"} gap={2}>
          {/* Title Field */}
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            {...register("title", { required: "Title is required" })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          {/* Author Field */}
          <TextField
            label="Author"
            variant="outlined"
            fullWidth
            {...register("author", { required: "Author name is required" })}
            error={!!errors.author}
            helperText={errors.author?.message}
          />
        </Box>
        {/* Content Field */}
        <TextField
          label="Content"
          variant="outlined"
          multiline
          rows={6}
          fullWidth
          {...register("content", { required: "Content is required" })}
          error={!!errors.content}
          helperText={errors.content?.message}
        />
        <Box display={"flex"} gap={2}>
          <Box flex={1}>
            {/* Tags Field */}
            <Stack direction="row" spacing={1}>
              <TextField
                label="Tags"
                variant="outlined"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleAddTag} edge="end">
                        <AddIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </Stack>

            {/* Display Tags */}
            {tags.length > 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Tags:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
          <Box flex={1}>
            {/* Image Upload Field */}
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: "55px" }}
            >
              Upload Files (optional)
              <input type="file" hidden multiple onChange={handleImageChange} />
            </Button>
            {!!image.length && (
              <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                {image.map((file, index) => (
                  <Chip
                    key={index}
                    label={file.name}
                    onDelete={() => removeImage(index)}
                    color="primary"
                    variant="outlined"
                    sx={{ maxWidth: "165px" }}
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Box>

        {/* Publish Date Field */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="publishDate"
            control={control}
            defaultValue={dayjs()}
            render={({ field }) => (
              <DesktopDatePicker
                label="Publish Date"
                value={field.value}
                onChange={field.onChange}
                // renderInput={(params) => <TextField {...params} fullWidth />}
              />
            )}
          />
        </LocalizationProvider>

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit Blog Post
        </Button>
      </Stack>
    </Box>
  );
};

export default NewBlog;
