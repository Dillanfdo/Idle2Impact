// src/components/Login.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import {
  TextField,
  IconButton,
  InputAdornment,
  Button,
  Grid2,
  Typography,
  Box,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import backgroundImage from "../assets/loginBackground.jpg";

const Login: React.FC = () => {
  const { login, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const isLoggedIn = await login(email, password);
    if (isLoggedIn) {
      navigate("/");
    } else {
      alert("Invalid email or password");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Grid2
      container
      flexDirection={"column"}
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        color: "white",
        height: "100vh",
      }}
    >
      <Typography variant="h2" margin={"20px auto"}>
        Login to Idle to Impact
      </Typography>
      <form onSubmit={handleLogin}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          width={"25%"}
          gap={2}
          margin={"100px auto"}
        >
          {/* <InputLabel>Email</InputLabel> */}
          <TextField
            sx={{ backgroundColor: "white" }}
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="filled"
          />
          {/* <InputLabel>Password</InputLabel> */}
          <TextField
            id="outlined-adornment-password"
            sx={{
              legend: { color: "red" },
              backgroundColor: "white",
            }}
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            variant="filled"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            // endAdornment={
            //   <InputAdornment position="end">
            //     <IconButton
            //       aria-label={
            //         showPassword ? "hide the password" : "display the password"
            //       }
            //       onClick={() => setShowPassword(!showPassword)}
            //       edge="end"
            //     >
            //       {showPassword ? <VisibilityOff /> : <Visibility />}
            //     </IconButton>
            //   </InputAdornment>
            // }
            label="Password"
          />
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </Box>
      </form>
    </Grid2>
  );
};

export default Login;
