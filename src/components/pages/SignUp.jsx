// src/pages/SignUp.jsx
import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import SignUpForm from '../Auth/SignUpForm';
import { supabase } from '../../utils/supabaseClient';

const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://dojourney.netlify.app/home', // Ganti dengan URL deployment kamu kalau online
    },
  });

  if (error) {
    console.error('Google login error:', error.message);
  }
};

const SignUp = () => {
  useEffect(() => {
      const script = document.createElement('script');
      script.src = './FinisherHeader.js';
      script.async = true;
      script.onload = () => {
        if (window.FinisherHeader) {
          new window.FinisherHeader({
            count: 12,
            size: { min: 1300, max: 1500, pulse: 0 },
            speed: {
              x: { min: 0.6, max: 3 },
              y: { min: 0.6, max: 3 },
            },
            colors: {
              background: "#7d3bce",
              particles: [ "#e07b49",
                "#27a4d4",
                "#1efedc",
                "#d6275b"],
            },
            blending: "overlay",
            opacity: { center: 0.6, edge: 0 },
            skew: 1,
            shapes: ["c"],
          });
        }
      };
      document.body.appendChild(script);
    }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">

      <div
        className="finisher-header"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '56vh',
          zIndex: -1,
          transform: 'skewY(-5deg)',
          transformOrigin: 'top left',
          overflow: 'hidden',
        }}
      />

      {/* Header */}
      <div className="w-full flex justify-between items-center p-6 absolute top-0 z-10">
        <img src="/assets/log.svg" alt="Dojo Logo" className="w-25 h-25" />
        <Link to="/login">
        <button className="border border-black px-4 py-2 rounded-md hover:bg-black hover:text-white transition">
        LOGIN
        </button>
        </Link>
      </div>

      {/* Form Card */}
      <div className="signup-container bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center z-10 relative">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign Up</h2>
        <p className="text-gray-500 text-sm mb-6">Easy Ways to Organize Your To-do List</p>

        {/* Google Sign Up */}
        <button onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-2 w-full bg-blue-100 text-gray-700 font-medium py-3 rounded-full mb-6 hover:bg-blue-200 transition">
        <img src="/assets/google.svg" alt="Google" className="w-5 h-5" />
        Sign up with Google
      </button>

        {/* Separator */}
        <div className="flex items-center justify-center mb-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-3 text-gray-400 text-sm">or Use Email</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <div className="text-left flex-1 overflow-y-auto pr-1">
          <SignUpForm />
        </div>

      </div>

      {/* Footer */}
      <footer className="absolute bottom-10 text-gray-400 text-xs text-center w-full z-10">
        © 2025 All Rights Reserved. Kelompok 22 | Dojo
      </footer>
    </div>
  );
};

export default SignUp;