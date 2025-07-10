import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Evaluations from './pages/Evaluations';
import Trainings from './pages/Trainings';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/evaluations" element={<Evaluations />} />
            <Route path="/trainings" element={<Trainings />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
