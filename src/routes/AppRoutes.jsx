// src/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/HomePage";
import Login from "../pages/LoginPage";
import ListFile from "../pages/ListFilesPage";
import ProfilePage from "../pages/ProfilePage";
import MineFiles from "../pages/MineFilesPage";
import {PrivateRoutes}  from "../components/PrivateRoutes";


export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoutes>
            <Home />
          </PrivateRoutes>
        }
      />
      <Route
        path="/ListFiles"
        element={
          <PrivateRoutes>
            <ListFile />
          </PrivateRoutes>
        }
      />
      <Route
        path="/Profile"
        element={
          <PrivateRoutes>
            <ProfilePage />
          </PrivateRoutes>
        }
      />
      <Route
        path="/MineFiles"
        element={
          <PrivateRoutes>
            <MineFiles />
          </PrivateRoutes>
        }
      />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
