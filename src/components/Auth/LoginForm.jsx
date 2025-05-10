import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../../index.css';

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

      // Cek apakah error terkait email atau password yang salah
      if (error.message.includes('Invalid login credentials')) {
        setError('Email atau password salah. Silakan coba lagi.');
      } else {
        setError(error.message); // Menampilkan error lainnya dari Supabase
      }
    } else {
      navigate('/home'); // Redirect ke home setelah login berhasil
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
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
