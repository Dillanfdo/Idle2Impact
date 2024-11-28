import { Route, Routes } from "react-router-dom";
import ProblemInfo from "./pages/ProblemInfo";

const ProblemRoutes = () => {
  return (
    <Routes>
      <Route path="/:pid" element={<ProblemInfo />} />
    </Routes>
  );
};

export default ProblemRoutes;
