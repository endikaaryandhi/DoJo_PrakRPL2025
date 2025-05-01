// src/components/Auth/SignUpForm.jsx
import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [fullName, setFullName] = useState(''); // Mengganti 'name' dengan 'fullName'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
  
    if (signUpError) {
      setError(signUpError.message);
    } else {
      // Logout paksa supaya tidak auto-login
      await supabase.auth.signOut();
      navigate('/login');
    }
  };
  
  return (
    <form onSubmit={handleSignUp} className="signup-form">
      {error && <p className="error">{error}</p>}
      
      {/* Input Full Name */}
      <input
        type="text"
        placeholder="Nama"
        value={fullName} 
        onChange={(e) => setFullName(e.target.value)}
        className="w-full h-10 px-5 py-2 rounded-2xl border border-gray-300 bg-gray-100 text-sm"
        required
      />
      
      {/* Input Email */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full h-10 px-5 py-2 rounded-2xl border border-gray-300 bg-gray-100 text-sm"
        required
      />
      
      {/* Input Password */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full h-10 px-5 py-2 rounded-2xl border border-gray-300 bg-gray-100 text-sm"
        required
      />
      
      {/* Tombol Submit */}
      <button type="submit">Lanjut</button>
    </form>
  );
};

export default SignUpForm;
