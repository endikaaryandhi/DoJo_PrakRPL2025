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
            placeholder="Judul Todo"
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

          <TimePicker onTimeChange={setTime} initialTime={time} />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
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
