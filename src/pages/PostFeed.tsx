import { Box, Card, Chip, Grid2, Link, Typography } from "@mui/material";
import data from "../jsons/problemStatementList.json";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const CardDetail = ({ label, value }: { label: string; value: string }) => {
  return (
    <Box display="flex" gap={1}>
      <Typography variant="body1" sx={{ color: "gray" }}>
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  );
};

const TechStackTag = ({ techStack }: { techStack: string }) => {
  return <Chip label={techStack} />;
};

const PostFeed = () => {
  const navigate = useNavigate();

  return (
    <Grid2 container gap={2} justifyContent={"center"} margin={"30px"}>
      {data.map((d) => (
        <Card
          sx={{
            height: "200px",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            width: "40%",
            padding: "20px",
            boxShadow: "4px 9px 10px #cabebe",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/problem/${d.problemId}`)}
        >
          <Typography variant="h5" sx={{ mb: 1 }}>
            {d.title}
          </Typography>
          <Typography variant="body1">{d.summary + d.summary}</Typography>
          <Box
            sx={{
              display: "flex",
              mt: 2,
              gap: 2,
            }}
          >
            <CardDetail label={"Owner:"} value={d.owner.name} />
            <CardDetail
              label={"Deadline:"}
              value={moment(d.deadline).format("DD/MM/YYYY")}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              {d.tech_stack.map((techStack) => (
                <TechStackTag techStack={techStack} />
              ))}
            </Box>
          </Box>
        </Card>
      ))}
    </Grid2>
  );
};

export default PostFeed;
