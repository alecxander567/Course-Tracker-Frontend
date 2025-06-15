import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/Landingpage.jsx";
import Homepage from './Components/Homepage';
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
        </Routes>
      </Router>
    </>
  )
}

export default App
