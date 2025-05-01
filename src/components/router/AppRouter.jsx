import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import { supabase } from '../../utils/supabaseClient';
import { useEffect, useState } from 'react';

const AppRouter = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek apakah user sudah login
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    // Listen event login/logout
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>; // loading screen sementara

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/home" />} />

        {/* Halaman Home dapat diakses tanpa login */}
        <Route path="/home" element={<Home />} />

        {/* Protected routes */}
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />

        {/* Default route */}
        <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
