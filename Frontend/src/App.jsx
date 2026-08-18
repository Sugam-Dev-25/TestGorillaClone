import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ExamScreen from "./pages/ExamScreen";
import ResultsScreen from "./pages/ResultsScreen";

import AdminDashboard from "./pages/admin/AdminDashboard";
import CategoryManager from "./pages/admin/CategoryManager";

import CreateAssessment from "./pages/recruiter/CreateAssessment";
import QuestionBank from "./pages/recruiter/QuestionBank";

import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Candidate / Default Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exam/:id"
        element={
          <ProtectedRoute>
            <ExamScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <ResultsScreen />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute>
            <CategoryManager />
          </ProtectedRoute>
        }
      />

      {/* Recruiter Routes */}
      <Route
        path="/recruiter/create"
        element={
          <ProtectedRoute>
            <CreateAssessment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recruiter/questions"
        element={
          <ProtectedRoute>
            <QuestionBank />
          </ProtectedRoute>
        }
      />

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}