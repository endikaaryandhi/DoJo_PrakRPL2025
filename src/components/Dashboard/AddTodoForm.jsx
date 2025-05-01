import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { toast } from 'react-hot-toast';

const AddTodoForm = ({ onTodoAdded }) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState(null);

  // Ambil kategori dari Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('category').select('*');
      if (error) {
        toast.error('Gagal mengambil kategori!');
      } else {
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].category_id);
        }
      }
    };

    fetchCategories();
  }, []);

  // Ambil user_id dari Supabase Auth
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        toast.error('Gagal mendapatkan user!');
        return;
      }
      setUserId(data.user.id); // Supabase Auth user ID (UUID)
    };

    getUser();
  }, []);

  // Fungsi untuk menambahkan todo
  const handleAddTodo = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!title.trim()) {
      toast.error('Judul tidak boleh kosong!');
      return;
    }

    if (!dueDate || !dueTime) {
      toast.error('Tanggal dan waktu harus dipilih!');
      return;
    }

    if (!categoryId || categoryId === '') {
      toast.error('Kategori harus dipilih!');
      return;
    }

    if (!userId) {
      toast.error('User belum login!');
      return;
    }

    const { error } = await supabase
      .from('task')
      .insert([{
        title,
        category_id: categoryId,
        priority,
        due_date: dueDate,
        due_time: dueTime,
        description,
        user_id: userId, // Menambahkan user_id ke dalam record
      }]);

    if (error) {
      console.error(error.message);
      toast.error('Gagal menambahkan todo!');
    } else {
      toast.success('Todo berhasil ditambahkan!');
      setTitle('');
      setCategoryId(categories.length > 0 ? categories[0].category_id : '');
      setPriority('medium');
      setDueDate('');
      setDueTime('');
      setDescription('');
      if (onTodoAdded) onTodoAdded();
    }
  };

  return (
    <form onSubmit={handleAddTodo} className="add-todo-form space-y-4">
      <input
        type="text"
        placeholder="Judul Todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full border px-3 py-2 rounded"
      />

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        {categories.map((cat) => (
          <option key={cat.category_id} value={cat.category_id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="time"
        value={dueTime}
        onChange={(e) => setDueTime(e.target.value)}
        required
        className="w-full border px-3 py-2 rounded"
      />

      <textarea
        placeholder="Deskripsi Todo"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      <button
        type="submit"
        className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
      >
        Tambah Todo
      </button>
    </form>
  );
};

export default AddTodoForm;
