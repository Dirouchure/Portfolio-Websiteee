import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ScrollToTop, DarkModeToggle } from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Education from './pages/Education';
import Experience from './pages/Experience';
import Projects from './pages/Projects';
import Certificates from './pages/Certificates';
import Contact from './pages/Contact';
import Services from './pages/Services';
import NotFound from './pages/NotFound';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProjects from './pages/admin/ManageProjects';
import ManageSkills from './pages/admin/ManageSkills';
import ManageCertificates from './pages/admin/ManageCertificates';
import ManageExperience from './pages/admin/ManageExperience';
import ManageEducation from './pages/admin/ManageEducation';
import ManageProfile from './pages/admin/ManageProfile';
import ChangePassword from './pages/admin/ChangePassword';
import Messages from './pages/admin/Messages';
import ManageServices from './pages/admin/ManageServices';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="projects" element={<ManageProjects />} />
                <Route path="skills" element={<ManageSkills />} />
                <Route path="certificates" element={<ManageCertificates />} />
                <Route path="experience" element={<ManageExperience />} />
                <Route path="education" element={<ManageEducation />} />
                <Route path="profile" element={<ManageProfile />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="messages" element={<Messages />} />
                <Route path="services" element={<ManageServices />} />
              </Routes>
            </ProtectedRoute>
          } />

          <Route path="/*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/education" element={<Education />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
              <DarkModeToggle />
              <ScrollToTop />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
