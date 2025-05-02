import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { toast } from 'react-hot-toast';
import TimePicker from './TimePicker';

const EditTodoModal = ({ todo, onClose, onTodoUpdated }) => {
  const [title, setTitle] = useState(todo.title || '');
  const [description, setDescription] = useState(todo.description || '');
  const [time, setTime] = useState(todo.due_time || '');
  const [date, setDate] = useState(todo.due_date || '');
  const [priority, setPriority] = useState(todo.priority || 'medium');
  const [categoryId, setCategoryId] = useState(todo.category_id || '');
  const [categories, setCategories] = useState([]);

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

  const handleUpdateTodo = async (e) => {
    e.preventDefault();

    if (!todo.task_id) {
      toast.error('ID Todo tidak tersedia!');
      console.error('Missing task_id:', todo);
      return;
    }

    if (!title.trim()) {
      toast.error('Judul tidak boleh kosong!');
      return;
    }

    if (!date || !time) {
      toast.error('Tanggal dan waktu harus diisi!');
      return;
    }

    if (!categoryId) {
      toast.error('Kategori harus dipilih!');
      return;
    }

    const { error } = await supabase
      .from('task')
      .update({
        title,
        description,
        due_time: time,
        due_date: date,
        priority,
        category_id: categoryId,
      })
      .eq('task_id', todo.task_id);

    if (error) {
      console.error('Error updating todo:', error);
      toast.error('Gagal update todo!');
    } else {
      toast.success('Todo berhasil diupdate!');
      onTodoUpdated();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-6 flex items-center gap-2">
          ✏️ Edit Todo
        </h2>
        <form onSubmit={handleUpdateTodo} className="space-y-5 text-sm">
          <div>
            <label className="block text-gray-600 mb-1">Judul</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              placeholder="Judul Todo"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi (opsional)"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg resize-none focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Kategori</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Prioritas</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Waktu</label>
            <TimePicker onTimeChange={setTime} initialTime={time} />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Tanggal</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTodoModal;
