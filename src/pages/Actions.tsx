import {
  Box,
  Button,
  Collapse,
  Grid2,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import problemList from "../jsons/problemStatementList.json";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import moment from "moment";
import { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import { getposts } from "../apis/apiFunctions";
import { ProblemInfoType, EnrolledUsers } from "../types/problemInfo";
import { getenrolledusers , updatestatus} from "../apis/apiFunctions";


const Actions = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [open, setOpen] = useState(-1);
  const getColorStatus = (status: string) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Declined":
        return "red";
      case "Pending":
        return "grey";
      default:
        return "inherit";
    }
  };

  const isApproved = (status: string) => status === "APPROVED";

  const [postData, setPostData] = useState<ProblemInfoType[]>([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await getposts();
        console.log("Fetched result:", result); 
        if (result.status === 1) {
          const feeds= JSON.parse(result.data).Table;
          console.log("feeds- ", feeds)
          let filteredFeeds= [];
          if(user?.role==="Mentor"){
            filteredFeeds = feeds.filter((feed: any) => feed.mentor_id === user?.user_id);
          }else{
            filteredFeeds = feeds.filter((feed: any) => feed.enrolledid === user?.user_id);
          }           
          setPostData(filteredFeeds);
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
  const [enrolledusers, setEnrolledusers] = useState<EnrolledUsers[]>([]);
  const getEnrolledUser = async (index: number, taskid: number)=>{
    setOpen(index === open ? -1 : index)
    const users = await getenrolledusers(taskid); 
    if(users.status==1){
      const parsedData = JSON.parse(users.data).Table;
      setEnrolledusers(parsedData);
    }
  }
  const updateenrolledstatus = async(id: number, taskid: number, status: number)=>{
    const result = await updatestatus(id, taskid, status);
    if(result.status==1){
      if(status===2){
        alert("Task Approved Successfully")
      }else{
        alert("Task Declined Successfully")
      }
      const users = await getenrolledusers(taskid); 
    if(users.status==1){
      const parsedData = JSON.parse(users.data).Table;
      setEnrolledusers(parsedData);
    }
    }else{
      alert("Failed to Update the task")
    }
  }

  return (
    <Grid2
      container
      gap={2}
      padding={"50px 150px 20px"}
      flexDirection={"column"}
    >
      {user?.role === "Mentor" ? (
        <Table sx={{ minWidth: 650, boxShadow: "9px 8px 8px #ccc5c5;" }} aria-label="simple table">
        <TableHead
          sx={{
            backgroundColor: "aliceblue",
          }}
        >
          <TableRow>
            <TableCell></TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {postData.map((row, index) => (
            <>
              <TableRow
                key={row.task_id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => getEnrolledUser(index, row.task_id)}
                  >
                    {open === index ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell>{row.task_id}</TableCell>
                <TableCell component="th" scope="row">
                  <Link onClick={() => navigate(`/problem/${row.task_id}`, { state: { post: row } })}>
                    {row.problem_statement}
                  </Link>
                </TableCell>
                <TableCell>{moment(row.dead_line).format("MMM DD, YYYY")}</TableCell>
                <TableCell align="right">{row.status}</TableCell>
              </TableRow>
      
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse in={open === index} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 3 }}>
                      <Typography variant="h6" gutterBottom component="div">
                        Applied Mentees
                      </Typography>
                      <Table size="small" aria-label="purchases">
                        <TableHead>
                          <TableRow>
                            <TableCell>Emp ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="left">Email</TableCell>
                            <TableCell align="right">Applied On</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {!enrolledusers.length && (
                            <Box display={"flex"} width={"100%"}>
                              <Typography>No one has enrolled Yet.</Typography>
                            </Box>
                          )}
                          {enrolledusers.map((data) => (
                            <TableRow key={data.user_id}>
                              <TableCell component="th" scope="row">
                                {data.user_id}
                              </TableCell>
                              <TableCell>{data.name}</TableCell>
                              <TableCell align="left">{data.email}</TableCell>
                              <TableCell align="right">
                                {moment(data.created_at).format("MMM DD, YYYY")}
                              </TableCell>
                              <TableCell align="right">
                                {data.enrolled_status==="Declined" && 
                                  <Button onClick={() => updateenrolledstatus(data.enrolledid, row.task_id,2)}>
                                  <DoneOutlineIcon sx={{ color: "green" }} />
                                </Button>
                                }
                                {data.enrolled_status==="Approved" &&
                                <Button onClick={() => updateenrolledstatus(data.enrolledid, row.task_id,3)}>
                                  <DoNotDisturbIcon sx={{ color: "red" }} />
                                </Button>
                                  }
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>      
      ) : (
        <Table
          sx={{ minWidth: 650, boxShadow: "9px 8px 8px #ccc5c5;" }}
          aria-label="simple table"
        >
          <TableHead
            sx={{
              backgroundColor: "aliceblue",
            }}
          >
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {postData.map((row) => (
              <TableRow
                key={row.task_id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: isApproved(row.status) ? "pointer" : "initial",
                  ":hover": {
                    backgroundColor: isApproved(row.status)
                      ? "lightgrey"
                      : "#fff",
                  },
                }}
              >
                <TableCell>{row.task_id}</TableCell>
                <TableCell component="th" scope="row">
                  {
                    <Link onClick={() => navigate(`/problem/${row.task_id}`, { state: { post: row }})}>
                      {
                        row.problem_statement
                      }
                    </Link>
                  }
                </TableCell>
                <TableCell>
                  {row.owner}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: getColorStatus(row.enrolledstatus) }}
                >
                  {row.enrolledstatus}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Grid2>
  );
};

export default Actions;
