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
import enrolledData from "../jsons/enrolledData.json";
import problemList from "../jsons/problemStatementList.json";
import adminProblemsList from "../jsons/adminProblemsList.json";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import moment from "moment";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";

const Actions = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [open, setOpen] = useState(-1);
  const getColorStatus = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "green";
      case "PENDING":
        return "primary";
      case "DECLINED":
        return "red";
      default:
        return "inherit";
    }
  };

  const createData = (status: string, id: string) => {
    return { status, id };
  };

  const userTableData = enrolledData.data.map(({ status, id }) => {
    return createData(status, id);
  });

  const isApproved = (status: string) => status === "APPROVED";

  const getAdminProblemStatus = (status: number) => {
    switch (status) {
      case 0:
        return "IDLE";
      case 1:
        return "APPLIED FOR";
      case 2:
        return "IN PROGRESS";
    }
  };

  return (
    <Grid2
      container
      gap={2}
      padding={"50px 150px 20px"}
      flexDirection={"column"}
    >
      {user?.role === "Admin" ? (
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
              <TableCell></TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminProblemsList.map((row, index) => (
              <>
                <TableRow
                  key={row.problemId}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => setOpen(index === open ? -1 : index)}
                    >
                      {open === index ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>{row.problemId}</TableCell>
                  <TableCell component="th" scope="row">
                    {
                      <Link
                        onClick={() => navigate(`/problem/${row.problemId}`)}
                      >
                        {row.title}
                      </Link>
                    }
                  </TableCell>
                  <TableCell>
                    {moment(row.deadline).format("MMM DD, YYYY")}
                  </TableCell>
                  <TableCell align="right">
                    {getAdminProblemStatus(row.status)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
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
                            {!row.appliedList.length && (
                              <Box display={"flex"} width={"100%"}>
                                <Typography>
                                  No one has enrolled Yet.
                                </Typography>
                              </Box>
                            )}
                            {row.appliedList.map((data) => (
                              <TableRow key={data.employeeID}>
                                <TableCell component="th" scope="row">
                                  {data.employeeID}
                                </TableCell>
                                <TableCell>{data.name}</TableCell>
                                <TableCell align="left">{data.email}</TableCell>
                                <TableCell align="right">
                                  {moment(data.appliedOn).format(
                                    "MMM DD, YYYY"
                                  )}
                                </TableCell>
                                <TableCell align="right">
                                  <Button>
                                    <DoneOutlineIcon sx={{ color: "green" }} />
                                  </Button>
                                  <Button>
                                    <DoNotDisturbIcon sx={{ color: "red" }} />
                                  </Button>
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
            {userTableData.map((row) => (
              <TableRow
                key={row.id}
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
                <TableCell>{row.id}</TableCell>
                <TableCell component="th" scope="row">
                  {
                    <Link onClick={() => navigate(`/problem/${row.id}`)}>
                      {
                        problemList.find((data) => data.problemId === row.id)
                          ?.title
                      }
                    </Link>
                  }
                </TableCell>
                <TableCell>
                  {problemList.find((data) => data.problemId === row.id)?.owner
                    .name || ""}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: getColorStatus(row.status) }}
                >
                  {row.status}
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
