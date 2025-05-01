import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { toast } from 'react-hot-toast';
import TimePicker from './TimePicker';

const EditTodoModal = ({ todo, onClose, onTodoUpdated }) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [time, setTime] = useState(todo.time || '');  // Inisialisasi dengan waktu yang ada pada todo
  const [categoryId, setCategoryId] = useState(todo.category_id);
  const [categories, setCategories] = useState([]);

  // Ambil data kategori dari Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('category').select('*');
      if (error) {
        toast.error('Gagal mengambil kategori!');
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  // Fungsi untuk mengupdate todo dengan waktu yang baru
  const handleUpdateTodo = async (e) => {
    e.preventDefault();

    // Pastikan waktu terisi
    if (!time) {
      toast.error('Waktu tidak boleh kosong!');
      return;
    }

    const { error } = await supabase
      .from('task')
      .update({ title, description, time, category_id: categoryId })
      .eq('id', todo.id);

    if (error) {
      toast.error('Gagal update todo!');
    } else {
      toast.success('Todo berhasil diupdate!');
      onTodoUpdated();
      onClose();
    }
  };

  return (
    <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="modal bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Edit Todo</h2>
        <form onSubmit={handleUpdateTodo} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi (opsional)"
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

          {/* TimePicker untuk memilih waktu */}
          <TimePicker
            onTimeChange={setTime}  // Pastikan waktu diubah dengan benar
            initialTime={time}  // Inisialisasi dengan waktu yang ada
          />

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTodoModal;
