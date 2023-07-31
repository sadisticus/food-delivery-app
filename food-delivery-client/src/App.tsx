import { Header } from "./components/Header";
import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import {
  Home,
  Login,
  Profile,
  Register,
  Store,
  Orders,
  Dashboard,
} from "./pages";
import { PrivateRoute } from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="bg-light pb-5" style={{ minHeight: "100vh" }}>
      <Header />
      <ToastContainer style={{ width: "40%" }} position="top-left" />
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stores/:id" element={<Store />} />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
