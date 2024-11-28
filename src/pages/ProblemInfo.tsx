import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { ProblemInfoType } from "../types/problemInfo";
import { useEffect, useState } from "react";
import data from "../jsons/problemStatementList.json";
import enrolledData from "../jsons/enrolledData.json";
import { Box, Button, Chip, Grid2, Link, Typography } from "@mui/material";
import moment from "moment";

const ProblemInfo = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [problemInfo, setProblemInfo] = useState<ProblemInfoType | null>();
  const [status, setStatus] = useState<string>("");
  const { pid } = params;

  useEffect(() => {
    const problemInfo = data.find((d) => d.problemId === pid);
    if (problemInfo) setProblemInfo({ ...problemInfo });
  }, [pid]);

  useEffect(() => {
    if (!enrolledData || !problemInfo) return;
    const enrollmentStatus = enrolledData.data.find(
      (data) => data.id === problemInfo.problemId
    );
    setStatus(enrollmentStatus ? enrollmentStatus.status : "");
  }, [enrolledData, problemInfo]);
  if (problemInfo) console.log(problemInfo.problemId in enrolledData);

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
                navigate("/");
              }}
            >
              Go Back
            </Link>
          </Box>
          <Grid2 container padding={"20px"} justifyContent={"space-between"}>
            <Grid2>
              <Typography variant="h2" color="#0076a8">
                {problemInfo?.title}
              </Typography>
              <Typography variant="h5" color="#767676" mt={1}>
                Project:
              </Typography>
              <Typography variant="h5">{problemInfo.project}</Typography>
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
                <Button
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
            {problemInfo.tech_stack.map((techStack) => (
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
                {moment(problemInfo.deadline).format("DD/MM/YYYY")}
              </Typography>
            </Grid2>
            <Grid2 flex={1}>
              <Typography variant="subtitle1" color="#767676">
                Mentor/Owner:
              </Typography>
              <Typography>{problemInfo.owner.name}</Typography>
            </Grid2>
          </Box>
        </>
      )}
    </>
  );
};

export default ProblemInfo;
