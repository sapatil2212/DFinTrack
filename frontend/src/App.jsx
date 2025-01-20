import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./Store";
import RegisterForm from "./pages/RegisterForm";
import LoginForm from "./pages/LoginForm";

import DangerAlertModal from "./components/DangerAlertModal";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/Aboutus";
import Services from "./pages/Services";
import Forgotpass from "./pages/Forgotpass";
import "./App.css";
import ContactUs from "./pages/ContactUs";
import Faq from "./pages/Faq";
import Dashboard2 from "./privatePages/Dashboard2";
import SecureRoute from "./pages/SecureRoute";

const App = () => {
  const location = useLocation();
  const hideHeaderFooterRoutes = [
    "/dashboard",
    "/dashboard2",
    "/revenuepage",
    "/login",
    "/signup",
    "/forgot-password",
  ];

  const shouldHideHeaderFooter = hideHeaderFooterRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <Provider store={Store}>
      <div>
        {!shouldHideHeaderFooter && <Header />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard2/*"
            element={
              <SecureRoute>
                <Dashboard2 />
              </SecureRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<Forgotpass />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/DangerAlertModal" element={<DangerAlertModal />} />
          <Route path="/faq" element={<Faq />} />
        </Routes>
        {!shouldHideHeaderFooter && <Footer />}
      </div>
    </Provider>
  );
};

export default App;
