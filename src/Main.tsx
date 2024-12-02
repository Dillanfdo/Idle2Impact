import { useEffect } from "react";
import { useUser } from "./contexts/UserContext";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/header";
import Actions from "./pages/Actions";
import BlogDetail from "./pages/BlogDetail";
import Blogs from "./pages/Blogs";
import NewBlog from "./pages/NewBlog";
import PostProblem from "./pages/PostProblem";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import ProblemRoutes from "./ProblemRoutes";
import Login from "./pages/Login";
import Home from "./pages/Home";

// Component to handle protected routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const Main = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("idle2impact");
    if (user) {
      setUser(JSON.parse(user));
      navigate("/");
      // navigate
    }
  }, []);

  return (
    <>
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
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route path="/new-blog" element={<NewBlog />} />
        {/* Blog Detail Page */}
        <Route path="/blogdetail/:id" element={<BlogDetail />} />
      </Routes>
    </>
  );
};

export default Main;
