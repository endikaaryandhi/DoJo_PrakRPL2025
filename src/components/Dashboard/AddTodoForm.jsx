import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { toast } from 'react-hot-toast';

const AddTodoForm = ({ onTodoAdded }) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [description, setDescription] = useState(''); // New state for description
  const [categories, setCategories] = useState([]);

  // Ambil kategori dari Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('category').select('*');
      if (error) {
        toast.error('Gagal mengambil kategori!');
      } else {
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].category_id); // Pastikan kita set category_id, bukan id jika nama kolomnya category_id
        }
      }
    };

    fetchCategories();
  }, []);

  // Log kategori yang dipilih
  useEffect(() => {
    console.log("Selected categoryId: ", categoryId); // Log untuk memverifikasi categoryId
  }, [categoryId]);

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

    console.log("Submitting categoryId: ", categoryId); // Log nilai categoryId saat submit

    // Kirim data ke Supabase untuk menambahkan todo baru
    const { error } = await supabase
      .from('task')
      .insert([{
        title,
        category_id: categoryId, // Pastikan ini UUID yang valid
        priority,
        due_date: dueDate,
        due_time: dueTime,
        description // Menambahkan description ke dalam data yang disubmit
      }]);

    // Menangani error atau sukses
    if (error) {
      console.error(error.message); // Log error lebih rinci
      toast.error('Gagal menambahkan todo!');
    } else {
      toast.success('Todo berhasil ditambahkan!');
      setTitle('');
      setCategoryId(categories.length > 0 ? categories[0].category_id : ''); // Menggunakan category_id
      setPriority('medium');
      setDueDate('');
      setDueTime('');
      setDescription(''); // Reset description after submit
      if (onTodoAdded) onTodoAdded();
    }
  };

  return (
    <form onSubmit={handleAddTodo} className="add-todo-form space-y-4">
      {/* Input untuk judul todo */}
      <input
        type="text"
        placeholder="Judul Todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full border px-3 py-2 rounded"
      />

      {/* Dropdown untuk memilih kategori */}
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

      {/* Dropdown untuk memilih prioritas */}
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {/* Input untuk memilih tanggal */}
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
        className="w-full border px-3 py-2 rounded"
      />

      {/* Input untuk memilih waktu */}
      <input
        type="time"
        value={dueTime}
        onChange={(e) => setDueTime(e.target.value)}
        required
        className="w-full border px-3 py-2 rounded"
      />

      {/* Textarea untuk deskripsi todo */}
      <textarea
        placeholder="Deskripsi Todo"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      />

      {/* Tombol untuk submit form */}
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
