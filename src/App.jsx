import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/Landingpage.jsx";
import Homepage from './Components/Homepage.jsx';
import Courses from './Components/Courses.jsx';
import Profile from './Components/Profile.jsx';
import Signup from './Pages/Signup.jsx';
import Login from './Pages/Login.jsx';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
