import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Person2Icon from "@mui/icons-material/Person2";
import AddIcon from "@mui/icons-material/Add";
import { Home } from "@mui/icons-material";
import WebIcon from "@mui/icons-material/Web";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { useUser } from "../contexts/UserContext";

const DrawerList = ({
  // setComponent,
  toggleDrawer,
}: {
  setComponent?: (val: "PostFeed" | "Profile" | "Add_Post") => void;
  toggleDrawer: (val: boolean) => void;
}) => {
  const navigate = useNavigate();
  const { user } = useUser();
  console.log(user, "dillan");
  const navigateFunc = (val: string) => {
    switch (val) {
      case "Home":
        navigate("/");
        break;
      case "Actions":
        navigate("/actions");
        break;
      case "Profile":
        navigate("/profile");
        break;
      case "Add New Post":
        navigate("/post-problem");
        break;
      case "Users":
        navigate("/users");
        break;
      case "Blogs":
        navigate("/blogs");
        break;
    }
    toggleDrawer(false);
  };
  return (
    <Box sx={{ width: 250 }} component={"div"} role="presentation">
      <List>
        {["Home", "Profile", "Actions", "Add New Post", "Blogs"].map(
          (text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => navigateFunc(text)}>
                <ListItemIcon>
                  {index === 0 && <Home />}
                  {index === 1 && <Person2Icon />}
                  {index === 2 && <PendingActionsIcon />}
                  {index === 3 && <AddIcon />}
                  {index === 4 && <WebIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          )
        )}
        {user?.role === "Admin" && (
          <ListItem key={"Users"} disablePadding>
            <ListItemButton onClick={() => navigateFunc("Users")}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary={"Users"} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default DrawerList;
