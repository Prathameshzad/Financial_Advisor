'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogin = () => router.push('/login');
  const handleRegister = () => router.push('/register');

  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-4 shadow-sm bg-white">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="bg-purple-500 rounded-full p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.105 0-2-.672-2-1.5S10.895 5 12 5s2 .672 2 1.5S13.105 8 12 8zm-6 8V8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <span className="text-xl font-semibold text-gray-800">FinEase</span>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="sm:hidden p-2 rounded-md text-gray-600 hover:text-black focus:outline-none"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Nav Links - Desktop */}
      <ul className="hidden sm:flex items-center space-x-6 text-gray-600">
        <li className="font-semibold text-black">Home</li>
        <li className="hover:text-black transition">About Us</li>
        <li className="hover:text-black transition">Blog</li>
        <li className="hover:text-black transition flex items-center space-x-1 cursor-pointer">
          <span>Pages</span>
          <ChevronDown size={16} />
        </li>
        <li className="hover:text-black transition">Pricing</li>
      </ul>

      {/* Auth Buttons - Desktop */}
      <div className="hidden sm:flex items-center space-x-4">
        <button onClick={handleLogin} className="text-gray-800 hover:text-black">Log In</button>
        <button
          onClick={handleRegister}
          className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition"
        >
          Get Started
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-10 px-4 py-2">
          <ul className="flex flex-col space-y-3 text-gray-600">
            <li className="font-semibold text-black py-2">Home</li>
            <li className="hover:text-black transition py-2">About Us</li>
            <li className="hover:text-black transition py-2">Blog</li>
            <li className="hover:text-black transition flex items-center justify-between py-2 cursor-pointer">
              <span>Pages</span>
              <ChevronDown size={16} />
            </li>
            <li className="hover:text-black transition py-2">Pricing</li>
          </ul>
          <div className="flex flex-col space-y-3 mt-4 pb-4">
            <button
              onClick={handleLogin}
              className="text-gray-800 hover:text-black py-2 text-left"
            >
              Log In
            </button>
            <button
              onClick={handleRegister}
              className="bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition w-full"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
