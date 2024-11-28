import {
  Box,
  Button,
  Card,
  Chip,
  Grid2,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import enrolledData from "../jsons/enrolledData.json";
import problemList from "../jsons/problemStatementList.json";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Actions = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const getColorStatus = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "primary";
      case "DECLINED":
        return "error";
      default:
        return "primary";
    }
  };

  // Handle File Upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedFiles((prev) => [...Array.from(event.target.files || [])]);
    }
  };

  return (
    <Grid2
      container
      gap={2}
      padding={"50px 150px 20px"}
      flexDirection={"column"}
    >
      {enrolledData.data.map(({ id, status }) => (
        <Card
          sx={{
            display: "flex",
            // width: "45%",
            justifyContent: "space-between",
            padding: "20px",
            flexDirection: "column",
            boxShadow: "4px 9px 10px #cabebe",
            cursor: "pointer",
          }}
        >
          <Box display={"flex"} justifyContent={"space-between"}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {problemList.find((data) => data.problemId === id)?.title}
              <Link
                onClick={() => navigate(`/problem/${id}`)}
                sx={{ fontSize: "12px", ml: 2, textDecoration: "none" }}
              >
                View Details
              </Link>
            </Typography>
            <Chip
              key={id}
              label={status}
              color={getColorStatus(status)}
              variant="outlined"
            />
          </Box>

          {status === "APPROVED" && (
            <>
              <Box sx={{ mt: 3, gap: 2 }} display={"flex"}>
                <Button variant="outlined" component="label">
                  Upload Zip File
                  <input type="file" hidden onChange={handleFileUpload} />
                </Button>

                {uploadedFiles.length > 0 && (
                  <Box>
                    {/* <Typography variant="subtitle1" gutterBottom>
                      Uploaded File:
                    </Typography> */}
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {uploadedFiles.map((file, index) => (
                        <Chip
                          key={index}
                          label={file.name}
                          onDelete={() =>
                            setUploadedFiles((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
              <Button
                variant="contained"
                sx={{ mt: 1 }}
                disabled={!uploadedFiles.length}
              >
                Submit
              </Button>
            </>
          )}
        </Card>
      ))}
      ;
    </Grid2>
  );
};

export default Actions;
