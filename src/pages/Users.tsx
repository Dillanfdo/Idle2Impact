import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid2,
  TextField,
  Button,
} from "@mui/material";
import userList from "../jsons/userList.json";
import { useState } from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";
const Users = () => {
  const [searchText, setSearchText] = useState("");
  const [employeeList, setEmployeeList] = useState([...userList]);
  const createData = (
    employeeID: string,
    name: string,
    email: string,
    status: string
  ) => {
    return { employeeID, name, email, status };
  };

  const rows = employeeList.map(({ name, status, employeeID, email }) => {
    return createData(employeeID, name, email, status);
  });

  return (
    <Grid2
      container
      gap={2}
      padding={"50px 100px 20px"}
      flexDirection={"column"}
    >
      <TextField
        placeholder="Search"
        sx={{ width: 400 }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

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
            <TableCell>Employee ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>EMail</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Switch</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows
            .filter((data) => {
              if (searchText)
                return (
                  data.name.toLowerCase().includes(searchText.toLowerCase()) ||
                  data.employeeID
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                  data.email.toLowerCase().includes(searchText.toLowerCase())
                );
              else return true;
            })
            .map((row, index) => (
              <TableRow
                key={row.employeeID}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell>{row.employeeID}</TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="text"
                    onClick={() => {
                      let res = [...employeeList];
                      res[index] = {
                        ...row,
                        status: row.status === "Mentee" ? "Mentor" : "Mentee",
                      };
                      setEmployeeList([...res]);
                    }}
                  >
                    <AutorenewIcon
                      sx={{ color: "rgb(25, 118, 210)", cursor: "pinter" }}
                    />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Grid2>
  );
};

export default Users;
