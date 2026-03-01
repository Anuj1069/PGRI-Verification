/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import SignInPage from "./components/SignInPage";
import SupportPage from "./components/SupportPage";
import GuidelinesPage from "./components/GuidelinesPage";
import ComplianceLogicPage from "./components/ComplianceLogicPage";
import DashboardPage from "./components/DashboardPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
          <Route path="/signin" element={<PageTransition><SignInPage /></PageTransition>} />
          <Route path="/support" element={<PageTransition><SupportPage /></PageTransition>} />
          <Route path="/guidelines" element={<PageTransition><GuidelinesPage /></PageTransition>} />
          <Route path="/compliance" element={<PageTransition><ComplianceLogicPage /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
        </Routes>
      </div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-display selection:bg-primary/20 selection:text-primary">
        <Navbar />
        <div className="flex-grow">
          <AnimatedRoutes />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

