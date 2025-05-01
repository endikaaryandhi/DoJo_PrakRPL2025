import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { toast } from 'react-hot-toast';

const AddTodoForm = ({ onTodoAdded }) => {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [datetime, setDatetime] = useState('');
  const [categories, setCategories] = useState([]);

  // Ambil data kategori dari tabel category
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('category').select('*');
      if (error) {
        toast.error('Gagal mengambil kategori!');
      } else {
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id); // set default
        }
      }
    };

    fetchCategories();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
  
    if (!title.trim()) {
      toast.error('Judul tidak boleh kosong!');
      return;
    }
  
    // Pastikan datetime memiliki nilai
    if (!datetime) {
      toast.error('Tanggal dan waktu harus dipilih!');
      return;
    }
  
    const { error } = await supabase
      .from('task')
      .insert([{ title, category_id: categoryId, priority, time: datetime }]);
  
    if (error) {
      toast.error('Gagal menambahkan todo!');
    } else {
      toast.success('Todo berhasil ditambahkan!');
      setTitle('');
      setCategoryId(categories.length > 0 ? categories[0].id : '');
      setPriority('medium');
      setDatetime('');
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
          <option key={cat.id} value={cat.id}>
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
        type="datetime-local"
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
        required
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
