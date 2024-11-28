import {
  Box,
  Button,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const PostProblem = () => {
  return (
    <Box padding={"30px"}>
      <Typography variant="h4">Post your problem:</Typography>
      <form>
        <Box padding={"30px"} display={"flex"} flexDirection={"column"} gap={2}>
          <TextField
            id="Title"
            label="Problem Statement Title"
            fullWidth
            // defaultValue="Default Value"
            // helperText="Some important text"
            variant="standard"
          />
          <TextField id="description" label="Description" multiline rows={5} />
          <Grid2 container gap={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Deadline" />
            </LocalizationProvider>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload files
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => console.log(event.target.files)}
                multiple
              />
            </Button>
          </Grid2>
        </Box>
      </form>
    </Box>
  );
};

export default PostProblem;
