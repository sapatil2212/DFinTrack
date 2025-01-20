import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import LogoIcon from "../assets/logoBlackbg.png";

const Footer = () => {
  const navigate = useNavigate();

  const handleOnClick = (event, to) => {
    if (window.location.pathname === "/") {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      navigate(to);
    } else {
      navigate(to);
    }
  };

  return (
    <footer className="w-full bg-black py-10 px-4">
      <div className="container mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="inline-block"
              onClick={(event) => handleOnClick(event, "/")}
            >
              <img src={LogoIcon} alt="Brand Logo" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/services", label: "Services" },
              { to: "/faqs", label: "FAQ's" },
              { to: "/login", label: "Login" },
              { to: "/signup", label: "Signup" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-white hover:text-neutral-400 transition-colors duration-200 font-poppins"
                onClick={(event) => handleOnClick(event, to)}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Contact Information */}
          <div className="text-gray-300 flex flex-col items-center md:items-end space-y-3">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2">
                <FaPhoneAlt className="text-white" />
                <a href="tel:+918208415943" className="hover:text-white">
                  +91 820 841 5943
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FaPhoneAlt className="text-white" />
                <a href="tel:+918830553868" className="hover:text-white">
                  +91 883 055 3868
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FaEnvelope className="text-white" />
              <a
                href="mailto:help@digiworldinfotech.com"
                className="hover:text-white"
              >
                help@digiworldinfotech.com
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-300 mb-4">
            © 2024, Digiworld Infotech Pvt. Ltd. All Rights Reserved.
          </p>

          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6">
            {[
              { Icon: FaFacebook, link: "https://facebook.com/yourpage" },
              { Icon: FaInstagram, link: "https://instagram.com/yourprofile" },
              { Icon: FaTwitter, link: "https://x.com/yourhandle" },
              { Icon: FaLinkedin, link: "https://linkedin.com/in/yourprofile" },
              { Icon: FaYoutube, link: "https://youtube.com/yourchannel" },
            ].map(({ Icon, link }) => (
              <a
                key={link}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <Icon className="h-6 w-6" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
