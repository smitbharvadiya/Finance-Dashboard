import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./componets/login";
import Register from "./componets/register";
import Dashboard from "./pages/dashboard";
import ApiDocumentation from "./pages/docs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/docs" element={<ApiDocumentation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;