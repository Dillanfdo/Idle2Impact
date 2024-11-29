import { Box, Card, Chip, Grid2, Link, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getposts } from "../apis/apiFunctions";
import { ProblemInfoType } from "../types/problemInfo";

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
  const [postData, setPostData] = useState<ProblemInfoType[]>([]); // Corrected useState with type annotation

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await getposts();
        console.log("Fetched result:", result); 
        if (result.status === 1) {
          const feeds= JSON.parse(result.data).Table;
          setPostData(feeds);
        } else {
          setPostData([]); 
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPostData([]); 
      }
    };
    fetchPosts();
  }, []); 
  
  return (
    <Grid2 container gap={2} justifyContent={"center"} margin={"30px"}>
      {postData.map((d) => (
        
        <Card
          key={d.task_id} // Ensure to add key for mapping
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
          onClick={() => navigate(`/problem/${d.task_id}`, { state: { post: d } })}
        >
          <Typography variant="h5" sx={{ mb: 1 }}>
            {d.problem_statement}
          </Typography>
          <Typography variant="body1">{d.description.length > 200 ? `${d.description.slice(0, 200)}...` : d.description}</Typography>
          <Box
            sx={{
              display: "flex",
              mt: 2,
              gap: 2,
            }}
          >
            <CardDetail label={"Owner:"} value={d.owner} />
            <CardDetail
              label={"Deadline:"}
              value={moment(d.dead_line).format("DD/MM/YYYY")}
            />
             <Box sx={{ display: 'flex', gap: 1 }}>
      {d.tech_stack.split(',').map((tech) => tech.trim()).map((techStack) => (
        <TechStackTag key={techStack} techStack={techStack} />
      ))}
    </Box>
          </Box>
        </Card>
      ))}
    </Grid2>
  );
};

export default PostFeed;
