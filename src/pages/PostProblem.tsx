import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  Chip,
  InputAdornment,
  IconButton,
  Grid2,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddIcon from "@mui/icons-material/Add";
import dayjs, { Dayjs } from "dayjs";
import { addPost } from "../apis/apiFunctions";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

interface FormData {
  title: string;
  description: string;
  deadline: Dayjs | null;
  expectedResult: string;
}

const ProjectForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>();
  const { user } = useUser();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState<string>("");
  const navigate = useNavigate();
  // Handle File Upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedFiles((prev) => [
        ...prev,
        ...Array.from(event.target.files || []),
      ]);
    }
  };

  // Remove File
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Add Tech Stack
  const handleAddTechStack = () => {
    if (techInput.trim()) {
      setTechStack((prev) => [...prev, techInput.trim()]);
      setTechInput("");
    }
  };

  // Remove Tech Stack
  const removeTechStack = (index: number) => {
    setTechStack((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    try {
      const postdata: any = {
        MentorId: user?.user_id,
        ProblemStatement: data.title,
        Description: data.description,
        TechStack: techStack ? techStack.join(", ") : "",
        ExpectedResult: data.expectedResult,
        DeadLine: data.deadline,
        Files: [],
      };

      const filePromises = uploadedFiles.map((file: File) => {
        return new Promise<void>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            try {
              const fileBase64 = reader.result as string;
              postdata.Files.push({
                fileName: file.name,
                fileType: file.type,
                fileContent: fileBase64,
              });
              resolve();
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });
      await Promise.all(filePromises);
      const result = await addPost(postdata);
      if (result.status == 1) {
        alert("Data submitted successfully!");
        navigate("/");
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
        // maxWidth: 600,
        mx: "auto",
        margin: "16px 42px 0",
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" mb={3}>
        Create Problem Statement
      </Typography>
      <Stack spacing={3}>
        <Box>
          {/* Title Field */}
          <TextField
            label="Title"
            variant="outlined"
            {...register("title", { required: "Title is required" })}
            error={!!errors.title}
            helperText={errors.title?.message}
            fullWidth
          />
        </Box>

        <Box display={"flex"} gap={2}>
          {/* Description Field */}
          <TextField
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            {...register("description", {
              required: "Description is required",
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
            fullWidth
          />

          {/* Deadline Field */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="deadline"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <DesktopDatePicker
                  label="Deadline"
                  // inputFormat="MM/DD/YYYY"
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  // renderInput={(params) => (
                  //   <TextField
                  //     {...params}
                  //     error={!!errors.deadline}
                  //     helperText={errors.deadline ? 'Deadline is required' : ''}
                  //     fullWidth
                  //   />
                  // )}
                />
              )}
              rules={{ required: "Deadline is required" }}
            />
          </LocalizationProvider>
        </Box>

        <Grid2 display={"flex"} gap={2}>
          {/* Tech Stack Field */}
          <Box flex={1}>
            <TextField
              label="Tech Stack"
              variant="outlined"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleAddTechStack} edge="end">
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />

            {/* Tech Stack Chips */}
            {techStack.length > 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Tech Stack:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {techStack.map((tech, index) => (
                    <Chip
                      key={index}
                      label={tech}
                      onDelete={() => removeTechStack(index)}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
          <Box flex={1}>
            {/* File Upload */}
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ height: "55px" }}
            >
              Upload Files (optional)
              <input type="file" multiple hidden onChange={handleFileUpload} />
            </Button>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Uploaded Files:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {uploadedFiles.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => removeFile(index)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </Grid2>

        {/* Expected Result */}
        <TextField
          label="Expected Result"
          variant="outlined"
          multiline
          rows={4}
          {...register("expectedResult", {
            required: "Expected result is required",
          })}
          error={!!errors.expectedResult}
          helperText={errors.expectedResult?.message}
          fullWidth
        />

        {/* Submit Button */}
        <Button type="submit" variant="contained" fullWidth>
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default ProjectForm;
