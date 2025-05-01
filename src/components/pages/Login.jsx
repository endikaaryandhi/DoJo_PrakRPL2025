// src/pages/Login.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../Auth/LoginForm';


const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-yellow-300 flex items-center justify-center p-4 relative">
      
      {/* Background putih miring di bawah */}
      <div className="skewed-white"></div>

      {/* Header */}
      <div className="w-full flex justify-between items-center p-6 absolute top-0 z-10">
        <img src="/assets/log.svg" alt="Dojo Logo" className="w-25 h-25" />
        <Link to="/signup">
          <button className="border border-black px-4 py-2 rounded-md hover:bg-black hover:text-white transition">
          DAFTAR
          </button>
        </Link>
      </div>

      {/* Kontainer utama login */}
      <div className="signup-container bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center z-10 relative">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
        <p className="text-gray-500 text-sm mb-6">Cara Mudah untuk Mengatur To-do List Kamu</p>

        <button className="flex items-center justify-center gap-2 w-full bg-blue-100 text-gray-700 font-medium py-3 rounded-full mb-6 hover:bg-blue-200 transition">
          <img src="/assets/google.svg" alt="Google" className="w-5 h-5" />
          Login dengan Google
        </button>

        <div className="flex items-center justify-center mb-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-3 text-gray-400 text-sm">atau Gunakan Email</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <div className="text-left flex-1 overflow-y-auto pr-1">
         <LoginForm />
        </div>


      </div>

      <footer className="absolute bottom-10 text-gray-400 text-xs text-center w-full z-10">
        © 2025 All Rights Reserved. Kelompok 22 | Dojo
      </footer>
    </div>
  );
};

export default Login;
