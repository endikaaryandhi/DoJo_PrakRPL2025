import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import AddTodoForm from '../Dashboard/AddTodoForm';
import EditTodoModal from '../Dashboard/EditTodoModal';
import LoadingSpinner from '../LoadingSpinner';

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
    fetchCategories();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('task')
      .select('*, category(name)');

    if (error) {
      toast.error('Gagal mengambil data todo!');
    } else {
      setTodos(data);
    }

    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('category').select('*');
    if (error) {
      toast.error('Gagal mengambil kategori!');
    } else {
      setCategories(data);
    }
  };

  const handleDeleteTodo = async (id) => {
    const confirmDelete = window.confirm('Yakin ingin menghapus todo ini?');
    if (!confirmDelete) return;

    const { error } = await supabase.from('task').delete().eq('id', id);

    if (error) {
      toast.error('Gagal menghapus todo!');
    } else {
      toast.success('Todo berhasil dihapus!');
      fetchTodos();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-4">
      <Toaster />

      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="text-pink-500 text-xl font-bold flex items-center gap-2">
          <img src="/assets/logo.svg" alt="Dojo" className="h-6" />
          DoJo
        </div>
        <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center font-semibold text-sm text-gray-800">
          SH
        </div>
      </header>

      {/* Greeting */}
      <section className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Halo, Sarah!</h1>
        <p className="text-gray-500">Hari ini, Senin 20 April 2025. Have a Nice Day!</p>
      </section>

      {/* Form Tambah Todo */}
      <section className="mb-6">
        <AddTodoForm onTodoAdded={fetchTodos} categories={categories} />
      </section>

      {/* Todo List per Kategori */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <section className="space-y-6">
          {categories.map((category) => {
            const filteredTodos = todos.filter(
              (todo) => todo.category?.name === category.name
            );

            return (
              <div key={category.id}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-700">
                    {category.name}{' '}
                    <span className="text-sm text-gray-400">^ {filteredTodos.length}</span>
                  </h3>
                  <hr className="flex-grow ml-2 border-gray-200" />
                </div>

                {filteredTodos.length > 0 ? (
                  <ul className="space-y-3">
                    {filteredTodos.map((todo) => (
                      <li
                        key={todo.id}
                        className="flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4" />
                          <span className="text-sm font-medium text-gray-800">{todo.title}</span>
                          {todo.category?.name && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-md font-semibold capitalize">
                              {todo.category.name}
                            </span>
                          )}
                          {todo.priority && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-md font-semibold capitalize">
                              {todo.priority}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          {todo.date && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded">{todo.date}</span>
                          )}
                          {todo.time && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded">{todo.time}</span>
                          )}
                          <button
                            onClick={() => setSelectedTodo(todo)}
                            className="bg-sky-500 hover:bg-sky-600 text-white text-xs px-3 py-1 rounded-md flex items-center gap-1"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-md flex items-center gap-1"
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-400 text-sm">Tidak ada tugas</p>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* Modal Edit */}
      {selectedTodo && (
        <EditTodoModal
          todo={selectedTodo}
          onClose={() => setSelectedTodo(null)}
          onTodoUpdated={fetchTodos}
        />
      )}
    </div>
  );
};

export default Home;

