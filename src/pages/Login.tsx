// src/components/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import {
  TextField,
  IconButton,
  InputAdornment,
  Button,
  OutlinedInput,
  Grid,
  Grid2,
  Typography,
  Box,
  InputLabel,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import './Login.scss';

const Login: React.FC = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const isLoggedIn = login(email, password);
    if (isLoggedIn) {
      navigate("/");
    } else {
      setError("Invalid email or password");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Grid2 container flexDirection={"column"}>
      <Typography variant="h2" margin={"20px auto"}>
        Login to IdletoImpact
      </Typography>
      <form onSubmit={handleLogin}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          width={"25%"}
          gap={2}
          margin={"50px auto"}
        >
          <InputLabel>Email</InputLabel>
          <OutlinedInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            sx={{
              legend: { color: "red" },
            }}
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? "hide the password" : "display the password"
                  }
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />

          {error && <p className="error">{error}</p>}

          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </Box>
      </form>
    </Grid2>
  );
};

export default Login;
