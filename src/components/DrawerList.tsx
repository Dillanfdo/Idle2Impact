import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Person2Icon from "@mui/icons-material/Person2";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import { Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const DrawerList = ({
  // setComponent,
  toggleDrawer,
}: {
  setComponent?: (val: "PostFeed" | "Profile" | "Add_Post") => void;
  toggleDrawer: (val: boolean) => void;
}) => {
  const navigate = useNavigate();
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
        case "Blogs":
        navigate("/blogs");
        break;
    }
    toggleDrawer(false);
  };
  return (
    <Box sx={{ width: 250 }} component={"div"} role="presentation">
      <List>
        {["Home", "Profile", "Actions", "Add New Post", "Favorites", "Blogs"].map(
          (text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={() => navigateFunc(text)}>
                <ListItemIcon>
                  {index === 0 && <Home />}
                  {index === 1 && <Person2Icon />}
                  {index === 2 && <PendingActionsIcon />}
                  {index === 3 && <AddIcon />}
                  {index === 4 && <FavoriteIcon />}
                  {index === 5 && <AddIcon />}
                </ListItemIcon>

                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Box>
  );
};

export default DrawerList;
