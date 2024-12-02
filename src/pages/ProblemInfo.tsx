import { useNavigate, useParams } from "react-router-dom";
import { ProblemInfoType } from "../types/problemInfo";
import { useEffect, useState } from "react";
import enrolledData from "../jsons/enrolledData.json";
import { Box, Button, Chip, Grid2, Link, Typography,Stack } from "@mui/material";
import moment from "moment";
import { useLocation } from 'react-router-dom';
import { useUser } from "../contexts/UserContext";
import { enrolltask } from "../apis/apiFunctions";
import { updatePost } from "../apis/apiFunctions";

const ProblemInfo = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [problemInfo, setProblemInfo] = useState<ProblemInfoType | null>();
  const [status, setStatus] = useState<string>("");
  const { pid } = params;
  const location = useLocation();
  const post = location.state?.post;
  const { user} = useUser();
  useEffect(() => {
    const problemInfo = post;
    if (problemInfo) setProblemInfo({ ...problemInfo });
    setStatus(problemInfo ? problemInfo.enrolledstatus : "");
  }, [pid]);

  const getColor = (status: any) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Declined":
        return "red";
      case "Pending":
        return "grey";
        case "Completed":
        return "green";
    }
  };
  const enroll= async ()=>{
    const enrolldata: any = {
      user_id: user?.user_id,
      mentor_id: problemInfo?.mentor_id,
      task_id: problemInfo?.task_id,
      status_id: 1
    };
    const result = await enrolltask(enrolldata);
    if (result.status == 1) {
      alert("Enrolled Successfully");
      setStatus("Pending")
    }
  }
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedFiles((prev) => [
        ...prev,
        ...Array.from(event.target.files || []),
      ]);
    }
  };
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };
const handleSubmit= async (taskid:number, userid:number)=>{
  const postdata: any = {
    TaskId: taskid,
    UserId: userid,
    Status: 4,
    Files: []
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
            fileContent: fileBase64
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
  const result = await updatePost(postdata);
  if (result.status == 1) {
    alert("Data submitted successfully!");
    navigate("/"); 
  }

}
  return (
    <>
      {problemInfo && (
        <>
          <Box padding={"10px 20px 0"}>
            <Link
              sx={{
                cursor: "pointer",
                textDecoration: "none",
              }}
              onClick={() => {
                navigate(-1);
              }}
            >
              Go Back
            </Link>
          </Box>
          <Grid2 container padding={"20px"} justifyContent={"space-between"}>
            <Grid2>
              <Typography variant="h2" color="#0076a8">
                {problemInfo?.problem_statement}
              </Typography>
            </Grid2>
            {user?.role == "Employee" &&
            <Grid2>
            { status ? (
              <Typography
                variant="h4"
                sx={{
                  border: `1px solid ${getColor(status)}`,
                  color: getColor(status),
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                {status}
              </Typography>
            ) : ( 
              <Button onClick={()=> enroll()}
                variant="contained"
                sx={{
                  width: "200px",
                  height: "50px",
                  margin: "10px",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                Enroll
              </Button>
            )
            }
          </Grid2>
            }            
            <Grid2>
              <Typography
                variant="body1"
                sx={{ fontSize: "20px", margin: "20px 10px" }}
              >
                {problemInfo.description}
              </Typography>
            </Grid2>
          </Grid2>
          <Box
            display={"flex"}
            padding={"10px 24px"}
            gap={2}
            alignItems={"center"}
          >
            <Typography variant="body1" color="#767676" fontSize={"2rem"}>
              Tech Stack:
            </Typography>
            {problemInfo.tech_stack.split(',').map((techStack) => (
              <Chip
                label={techStack}
                sx={{ fontSize: "1.5rem" }}
                key={techStack}
              />
            ))}
          </Box>
          <Box display={"flex"} padding={3}>
            <Grid2 flex={1}>
              <Typography variant="subtitle1" color="#767676">
                Files to download:
              </Typography>
              <Link sx={{ cursor: "pointer" }}>Download Files</Link>
            </Grid2>

            <Grid2 flex={1}>
              <Typography variant="subtitle1" color="#767676">
                Deadline:
              </Typography>
              <Typography>
                {moment(problemInfo.dead_line).format("DD/MM/YYYY")}
              </Typography>
            </Grid2>
            <Grid2 flex={1}>
              <Typography variant="subtitle1" color="#767676">
                Mentor/Owner:
              </Typography>
              <Typography>{problemInfo.owner}</Typography>
            </Grid2>
          </Box>
          <Box>
            <Typography variant="h5">Expected Result:</Typography>
            <Typography variant="body1" padding={"20px"}>
              {problemInfo.expected_result}
            </Typography>
          </Box>
          {user?.role === "Employee" && status === "Approved" && (
            <div>
              <Typography variant="h5">Submit Result:</Typography>
              <Button variant="outlined" component="label">
                Upload Files
                <input type="file" multiple hidden onChange={handleFileUpload} />
              </Button>
              <Button type="submit" onClick={()=> handleSubmit(problemInfo.task_id, user.user_id)} variant="contained" style={{ marginLeft: "10px" }}>
                Submit
              </Button>
            </div>
          )}          
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
        </>
      )}
    </>
  );
};

export default ProblemInfo;
