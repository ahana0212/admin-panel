// /src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import Home from "../pages/home";
import TableInfo from "../pages/TableInfo";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }>
        <Route path="/" element={<Home />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="table/:name" element={<TableInfo />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
