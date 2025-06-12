// footer.jsx
import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 px-6 py-12 border-t">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        {/* Branding and description */}
        <div className="space-y-4 max-w-sm">
          <div className="flex items-center space-x-2">
            <div className="text-3xl text-purple-500">
              <span className="font-bold text-purple-500">👾</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FinEase</span>
          </div>
          {/* <p className="text-sm text-gray-600">
            (SaaS) platform is tailored to streamline your{" "}
            <span className="text-purple-500">financial</span> operations.
          </p> */}
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold mb-2">Useful Links</h4>
            <ul className="space-y-1 text-sm">
              <li>Home</li>
              <li>About us</li>
              <li>Features</li>
              <li>Pricing</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Resources</h4>
            <ul className="space-y-1 text-sm">
              <li>Blog</li>
              <li>Podcast</li>
              <li>Webinars</li>
              <li>Press</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-1 text-sm">
              <li>Careers</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
              <li>Cookie Preferences</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Community</h4>
            <p className="text-sm mb-4">
              Join our global community of finance & creative peoples
            </p>
            <button className="bg-purple-500 text-white text-sm px-4 py-2 rounded-full">
              Let’s Join Now
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="mt-10 border-t pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>© 2025 Group P.Zad</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <FaFacebookF />
          <FaInstagram />
          <FaTwitter />
          <FaLinkedinIn />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
