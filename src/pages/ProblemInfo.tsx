import { useNavigate, useParams } from "react-router-dom";
import { ProblemInfoType } from "../types/problemInfo";
import { useEffect, useState } from "react";
import enrolledData from "../jsons/enrolledData.json";
import { Box, Button, Chip, Grid2, Link, Typography } from "@mui/material";
import moment from "moment";
import { useLocation } from 'react-router-dom';
import { useUser } from "../contexts/UserContext";
import { enrolltask } from "../apis/apiFunctions";

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
  }, [pid]);

  // useEffect(() => {
  //   if (!enrolledData || !problemInfo) return;
  //   const enrollmentStatus = enrolledData.data.find(
  //     (data) => data.id === problemInfo.task_id
  //   );
  //   setStatus(enrollmentStatus ? enrollmentStatus.status : "");
  // }, [enrolledData, problemInfo]);
  // if (problemInfo) console.log(problemInfo.task_id in enrolledData);

  const getColor = () => {
    switch (status) {
      case "APPROVED":
        return "green";
      case "DECLINED":
        return "red";
      case "PENDING":
        return "grey";
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
            <Grid2>
              {status ? (
                <Typography
                  variant="h4"
                  sx={{
                    border: `1px solid ${getColor()}`,
                    color: getColor(),
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
              )}
            </Grid2>
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
            <Typography variant="h3">Expected Result:</Typography>
            <Typography variant="body1" padding={"20px"}>
              {problemInfo.expected_result}
            </Typography>
          </Box>
        </>
      )}
    </>
  );
};

export default ProblemInfo;
