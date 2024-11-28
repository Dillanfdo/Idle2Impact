// src/components/Home.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  Menu,
  Toolbar,
  Typography,
} from "@mui/material";
// import "./Home.scss";
import MenuIcon from "@mui/icons-material/Menu";
import DrawerList from "../components/DrawerList";
import Header from "../components/header";
import Profile from "./Profile";
import PostProblem from "./PostProblem";
import PostFeed from "./PostFeed";

type Problem = {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  postedBy: string;
  createdAt: string;
};

const Home: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [component, setComponent] = useState<
    "PostFeed" | "Profile" | "Add_Post"
  >("PostFeed");
  useEffect(() => {
    // Fetch problem data from JSON (simulate API call)
    fetch("/src/data/problems.json")
      .then((response) => response.json())
      .then((data) => setProblems(data))
      .catch((error) => console.error("Error fetching problems:", error));
  }, []);

  const selectedComponent = () => {
    switch (component) {
      case "PostFeed":
        return <PostFeed />;
      case "Profile":
        return <Profile />;
      case "Add_Post":
        return <PostProblem />;
    }
  };

  return (
    <div className="home">
      {/* <Header setComponent={setComponent} /> */}
      <>{selectedComponent()}</>
      <section className="problems-list">
        {problems.map((problem) => (
          <div key={problem.id} className="problem-item">
            <h2>{problem.title}</h2>
            <p>{problem.description}</p>
            <p>
              <strong>Tech Stack:</strong> {problem.techStack.join(", ")}
            </p>
            <p>
              <strong>Posted By:</strong> {problem.postedBy} on{" "}
              {new Date(problem.createdAt).toLocaleDateString()}
            </p>
            <Link to={`/problem/${problem.id}`} className="view-details">
              View Details
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
