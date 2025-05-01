// src/components/Dashboard/EditTodoModal.jsx
import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { toast } from 'react-hot-toast';
import TimePicker from './TimePicker'; // import TimePicker


const EditTodoModal = ({ todo, onClose, onTodoUpdated }) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [time, setTime] = useState(todo.time || '');


  const handleUpdateTodo = async (e) => {
    e.preventDefault();
  
    const { error } = await supabase
      .from('todos')
      .update({ title, description, time }) // ikut update time
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
<div className="modal-backdrop">
  <div className="modal">
    <h2>Edit Todo</h2>
    <form onSubmit={handleUpdateTodo}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <TimePicker onTimeChange={setTime} initialTime={time} />


      <div className="modal-actions">
        <button type="submit">Simpan</button>
        <button type="button" onClick={onClose}>Batal</button>
      </div>
    </form>
  </div>
</div>

  );
};

export default EditTodoModal;
