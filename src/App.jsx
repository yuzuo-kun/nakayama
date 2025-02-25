import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import RecipeList from "./components/RecipeList";
import Order from "./components/Order";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/recipe" 
          element={
            <ProtectedRoute>
              <RecipeList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order" 
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;