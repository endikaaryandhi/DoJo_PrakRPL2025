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
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('category').select('*');
      if (error) {
        toast.error('Failed to take category!');
      } else {
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].category_id);
        }
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        toast.error('Failed to get user!');
        return;
      }
      setUserId(data.user.id);
    };
    getUser();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title cannot be empty!');
      return;
    }
    if (!dueDate || !dueTime) {
      toast.error('Date and time must be selected!');
      return;
    }
    if (!categoryId || categoryId === '') {
      toast.error('Category must be selected!');
      return;
    }
    if (!userId) {
      toast.error('User is not logged in!');
      return;
    }

    const { error } = await supabase.from('task').insert([{
      title,
      category_id: categoryId,
      priority,
      due_date: dueDate,
      due_time: dueTime,
      description,
      user_id: userId,
    }]);

    if (error) {
      console.error(error.message);
      toast.error('Failed to add todo!');
    } else {
      toast.success('Todo successfully added!');
      setTitle('');
      setCategoryId(categories.length > 0 ? categories[0].category_id : '');
      setPriority('medium');
      setDueDate('');
      setDueTime('');
      setDescription('');
      if (onTodoAdded) onTodoAdded();
      setIsAdding(false);
    }
  };

  return (
    <form onSubmit={handleAddTodo} className="flex flex-wrap gap-2 mb-4 items-center">
      <input
        type="text"
        placeholder="Add New Task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="flex-1 min-w-[150px] px-2 py-1 border rounded text-sm"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="flex-1 min-w-[150px] h-8 px-2 py-1 border rounded text-sm" // Set height to 5rem (adjustable)
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
        className="flex-1 min-w-[120px] px-2 py-1 border rounded text-sm"
        placeholder="Select Date"
      />

      <input
        type="time"
        value={dueTime}
        onChange={(e) => setDueTime(e.target.value)}
        required
        className="flex-1 min-w-[100px] px-2 py-1 border rounded text-sm"
        placeholder="Select Time"
      />

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="flex-1 min-w-[150px] px-2 py-1 border rounded text-sm"
      >
        <option value="" disabled selected>Pilih Kategori</option>
        {categories.map((cat) => (
          <option key={cat.category_id} value={cat.category_id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="flex-1 min-w-[120px] px-2 py-1 border rounded text-sm"
      >
        <option value="" disabled selected>Pilih Prioritas</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {!isAdding ? (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex-1 min-w-[120px] bg-pink-500 hover:bg-pink-600 text-white px-2 py-1 rounded text-sm"
        >
          + Add
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
          >
            ✔️
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAdding(false);
              setTitle('');
              setDueDate('');
              setDueTime('');
              setPriority('medium');
              setDescription('');
              setCategoryId(categories.length > 0 ? categories[0].category_id : '');
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
          >
            ❌
          </button>
        </div>
      )}
    </form>
  );
};

export default AddTodoForm;
