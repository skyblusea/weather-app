import { DetailPage } from "@/pages/detail";
import { HomePage } from "@/pages/home";
import { Route, Routes } from "react-router";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/detail" element={<DetailPage />} />
    </Routes>
  );
};
