import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Course from './Course';  // หน้า Course

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/course" element={<Course />} /> {/* หน้า Course */}
      </Routes>
    </Router>
  );
}

export default App;
