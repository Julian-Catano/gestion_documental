// src/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/HomePage";
import Login from "../pages/LoginPage";
import ListFile from "../pages/ListFilesPage";
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
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
