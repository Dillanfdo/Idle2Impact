import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
} from "@mui/material";
import DrawerList from "./DrawerList";
import { useUser } from "../contexts/UserContext";
import React from "react";
import MenuIcon from "@mui/icons-material/Menu";

const Header = ({
  setComponent,
}: {
  setComponent?: (val: "PostFeed" | "Profile" | "Add_Post") => void;
}) => {
  const { user, logout } = useUser();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <>
      {user && (
        <>
          <header className="home-header">
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={() => {
                    toggleDrawer(true);
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" flexGrow={1}>
                  Idle2Impact
                </Typography>
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>
              </Toolbar>
            </AppBar>
          </header>
          <Drawer open={open} onClose={() => toggleDrawer(false)}>
            <DrawerList toggleDrawer={toggleDrawer} />
          </Drawer>
        </>
      )}
    </>
  );
};

export default Header;
