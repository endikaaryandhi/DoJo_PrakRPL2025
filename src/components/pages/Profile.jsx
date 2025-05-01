import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { toast } from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Ambil data profil dari Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase.auth.getUser();
      const user = data?.user;
  
      if (error || !user) {
        toast.error('User tidak ditemukan');
        navigate('/login');
        return;
      }
  
      setUserId(user.id);
      setName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
    };
  
    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Gagal logout!');
    } else {
      navigate('/login');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error('User belum dimuat!');
      return;
    }
    
      const { data, error } = await supabase.auth.updateUser({
        email,
        password: password || undefined, // hanya update jika ada password
        data: {
          full_name: name,
        },
      });
    
      if (error) {
        toast.error('Gagal menyimpan perubahan');
      } else {
        toast.success('Profil berhasil diperbarui!');
      }
    };
    
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-4">
      <header className="flex justify-between items-center mb-6">
        <div className="text-pink-500 text-xl font-bold flex items-center gap-2">
          <img src="/assets/logo.svg" alt="Dojo" className="h-10" />
        </div>
        <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center font-semibold text-sm text-gray-800">
          {name?.[0]?.toUpperCase() ?? ''}
        </div>
      </header>

      <section className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Halo, {name}!</h1>
        <p className="text-gray-500">
          Hari ini, {new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
          . Have a Nice Day!
        </p>
      </section>

      <div className="bg-white rounded-2xl shadow p-6 flex max-w-4xl mx-auto">
        <aside className="w-1/4 border-r pr-4 space-y-4">
          <button className="w-full flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 text-left font-medium text-gray-700">
            ✏️ Edit Profil
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-md text-left text-blue-600 hover:bg-gray-100"
          >
            ↩ Log Out
          </button>
        </aside>

        <main className="w-3/4 pl-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Nama</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Password Baru</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="bg-sky-500 text-white px-6 py-2 rounded-md hover:bg-sky-600"
            >
              Simpan
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default Profile;
