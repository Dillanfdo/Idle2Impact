// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
// import './App.scss';
import PostProblem from "./pages/PostProblem";
import Profile from "./pages/Profile";
import Header from "./components/header";
import ProblemRoutes from "./ProblemRoutes";
import Actions from "./pages/Actions";
import Blogs from "./pages/Blogs";
import NewBlog from "./pages/NewBlog";
import BlogDetail from "./pages/BlogDetail";

// Component to handle protected routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/problem/*" element={<ProblemRoutes />} />
          <Route
            path="/post-problem"
            element={
              <ProtectedRoute>
                <PostProblem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/actions"
            element={
              <ProtectedRoute>
                <Actions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs"
            element={
              <ProtectedRoute>
                <Blogs />
              </ProtectedRoute>
            }
          />
           <Route path="/new-blog" element={<NewBlog />} />
           <Route path="/blogdetail/:id" element={<BlogDetail />} />  {/* Blog Detail Page */}
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
