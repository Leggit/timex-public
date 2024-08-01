import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import TimeSheetPage from "./pages/TimeSheetPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SignInPage from "./pages/SignInPage";
import { useAuth } from "./hooks/auth";
import HolidaysPage from "./pages/HolidaysPage";

function App() {
  const { user } = useAuth();
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <ProtectedRoute
              allow={!user}
              redirectPath="/timesheet"
              children={<SignInPage />}
            />
          }
        />
        <Route
          path="/timesheet"
          element={
            <ProtectedRoute
              allow={!!user}
              redirectPath="/login"
              children={<TimeSheetPage />}
            />
          }
        />
        <Route
          path="/holidays"
          element={
            <ProtectedRoute
              allow={!!user}
              redirectPath="/login"
              children={<HolidaysPage />}
            />
          }
        />
        <Route path="/" element={<Navigate to="/timesheet" replace={true} />} />
      </Routes>
    </Router>
  );
}

export default App;
