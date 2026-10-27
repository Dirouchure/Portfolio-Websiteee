import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ScrollToTop, DarkModeToggle } from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Education from './pages/Education';
import Experience from './pages/Experience';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Certificates from './pages/Certificates';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProjects from './pages/admin/ManageProjects';
import ManageSkills from './pages/admin/ManageSkills';
import ManageCertificates from './pages/admin/ManageCertificates';
import ManageEducation from './pages/admin/ManageEducation';
import ManageExperience from './pages/admin/ManageExperience';
import ManageServices from './pages/admin/ManageServices';
import ManageProfile from './pages/admin/ManageProfile';
import ChangePassword from './pages/admin/ChangePassword';
import Messages from './pages/admin/Messages';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import './styles/animations.css';

function App() {
  return (
    <Router>
      <div className="App">
        <LoadingScreen />
        <CustomCursor />
        <Routes>
          <Route path="/admin/login" element={<Login />} />
          
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="projects" element={<ManageProjects />} />
                <Route path="skills" element={<ManageSkills />} />
                <Route path="services" element={<ManageServices />} />
                <Route path="experience" element={<ManageExperience />} />
                <Route path="education" element={<ManageEducation />} />
                <Route path="certificates" element={<ManageCertificates />} />
                <Route path="profile" element={<ManageProfile />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="messages" element={<Messages />} />
              </Routes>
            </ProtectedRoute>
          } />

          <Route path="/*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/education" element={<Education />} />
                <Route path="/certificates" element={<Certificates />} />
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
