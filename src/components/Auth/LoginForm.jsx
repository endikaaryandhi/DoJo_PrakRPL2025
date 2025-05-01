// src/components/Auth/LoginForm.jsx
import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.log('Login error:', error); // Log error dari Supabase
      setError(error.message);
    } else {
      navigate('/home'); // redirect ke home setelah login
    }
  };  

  return (
    <form onSubmit={handleLogin} className="login-form">
      {error && <p className="error">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full h-10 px-5 py-2 rounded-2xl border border-gray-300 bg-gray-100 text-sm"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full h-10 px-5 py-2 rounded-2xl border border-gray-300 bg-gray-100 text-sm"
        required
      />
      <button type="submit">Masuk</button>
    </form>
  );
};

export default LoginForm;
