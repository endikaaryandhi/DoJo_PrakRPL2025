import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import AddTodoForm from '../Dashboard/AddTodoForm';
import EditTodoModal from '../Dashboard/EditTodoModal';
import LoadingSpinner from '../LoadingSpinner';

const categories = ['Kerjaan', 'Personal', 'Lainnya'];

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos(); // Ambil semua todos tanpa filter
  }, []);

  const fetchTodos = async () => {
    setLoading(true);

    // Ambil semua data todo tanpa filter tanggal
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

  const handleDeleteTodo = async (id) => {
    const confirmDelete = window.confirm('Yakin ingin menghapus todo ini?');
    if (!confirmDelete) return;

    const { error } = await supabase.from('task').delete().eq('id', id);

    if (error) {
      toast.error('Gagal menghapus todo!');
    } else {
      toast.success('Todo berhasil dihapus!');
      fetchTodos(); // panggil ulang untuk refresh
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-4">
      <Toaster />

      {/* Header tanpa tombol logout */}
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
        <AddTodoForm onTodoAdded={fetchTodos} />
      </section>

      {/* Todo List per Kategori */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <section className="space-y-6">
          {categories.map((category) => {
            const filteredTodos = todos.filter(
              (todo) => todo.category?.name === category
            );

            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-700">
                    {category}{' '}
                    <span className="text-sm text-gray-400">
                      ^ {filteredTodos.length}
                    </span>
                  </h3>
                  <hr className="flex-grow ml-2 border-gray-200" />
                </div>

                {filteredTodos.length > 0 ? (
                  <ul className="space-y-3">
                    {filteredTodos.map((todo) => (
                      <li
                        key={todo.id}
                        className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg"
                      >
                        <input type="checkbox" />
                        <span className="flex-grow font-medium">{todo.title}</span>
                        {todo.category?.name && (
                          <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded">
                            {todo.category.name}
                          </span>
                        )}
                        {todo.priority && (
                          <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
                            {todo.priority}
                          </span>
                        )}
                        {todo.date && (
                          <span className="text-sm text-gray-500">{todo.date}</span>
                        )}
                        {todo.time && (
                          <span className="text-sm text-gray-500">{todo.time}</span>
                        )}
                        <button
                          onClick={() => setSelectedTodo(todo)}
                          className="bg-sky-500 text-white px-3 py-1 rounded hover:bg-sky-600 text-sm"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                        >
                          🗑️ Hapus
                        </button>
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
