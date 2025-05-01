// src/components/Dashboard/AddTodoForm.jsx
import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { toast } from 'react-hot-toast';
import TimePicker from './TimePicker';


const AddTodoForm = ({ onTodoAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');


  const handleAddTodo = async (e) => {
    e.preventDefault();
  
    if (!title.trim()) {
      toast.error('Judul tidak boleh kosong!');
      return;
    }
  
    const { data, error } = await supabase
      .from('todos')
      .insert([{ title, description, time }]); // ⬅️ sekarang ikut simpan jam juga
  
    if (error) {
      toast.error('Gagal menambahkan todo!');
    } else {
      toast.success('Todo berhasil ditambahkan!');
      setTitle('');
      setDescription('');
      setTime('');
      if (onTodoAdded) {
        onTodoAdded();
      }
    }
  };

  return (
<form onSubmit={handleAddTodo} className="add-todo-form">
  <input
    type="text"
    placeholder="Judul Todo"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    required
  />
  <textarea
    placeholder="Deskripsi (Opsional)"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
  />
  
  <TimePicker onTimeChange={setTime} /> {/* ⬅️ Tambahkan ini */}

  <button type="submit">Tambah Todo</button>
</form>

  );
};

export default AddTodoForm;
