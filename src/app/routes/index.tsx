import { Routes, Route } from "react-router";
import { HomePage } from "@/pages/home";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};
