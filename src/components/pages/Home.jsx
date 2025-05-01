// Home.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import AddTodoForm from '../Dashboard/AddTodoForm';
import EditTodoModal from '../Dashboard/EditTodoModal';
import LoadingSpinner from '../LoadingSpinner';

const Home = () => {
  const [user, setUser] = useState(null);
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        navigate('/login');
      } else {
        setUser(user);
      }
    };

    getUser();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('task')
      .select('*, category(name, category_id)')
      .eq('user_id', user.id);

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

  const handleDeleteTodo = async (task_id) => {
    const confirmDelete = window.confirm('Yakin ingin menghapus todo ini?');
    if (!confirmDelete) return;

    const { error } = await supabase.from('task').delete().eq('task_id', task_id);
    if (error) {
      toast.error('Gagal menghapus todo!');
    } else {
      toast.success('Todo berhasil dihapus!');
      fetchTodos();
    }
  };

  const getUserName = () => {
    if (!user) return 'Pengguna';
    return user.user_metadata?.name || user.email;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-4">
      <Toaster />

      <header className="flex justify-between items-center mb-6">
        <div className="text-pink-500 text-xl font-bold flex items-center gap-2">
          <img src="/assets/logo.svg" alt="Dojo" className="h-6" />
          DoJo
        </div>
        <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center font-semibold text-sm text-gray-800">
          {getUserName().slice(0, 2).toUpperCase()}
        </div>
      </header>

      <section className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Halo, {getUserName()}!</h1>
        <p className="text-gray-500">
          Hari ini, {new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}. Have a Nice Day!
        </p>
      </section>

      <section className="mb-6">
        <AddTodoForm onTodoAdded={fetchTodos} categories={categories} userId={user?.id} />
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <section className="space-y-6">
          {categories.map((category) => {
            const filteredTodos = todos.filter(
              (todo) => todo.category?.name === category.name
            );

            return (
              <div key={category.category_id}>
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
                        key={todo.task_id}
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
                          {todo.due_date && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded">{todo.due_date}</span>
                          )}
                          {todo.due_time && (
                            <span className="bg-gray-100 px-2 py-0.5 rounded">{todo.due_time}</span>
                          )}
                          <button
                            onClick={() =>
                              setSelectedTodo({
                                task_id: todo.task_id,
                                title: todo.title,
                                description: todo.description,
                                due_date: todo.due_date,
                                due_time: todo.due_time,
                                priority: todo.priority,
                                category_id: todo.category_id || todo.category?.category_id,
                              })
                            }
                            className="bg-sky-500 hover:bg-sky-600 text-white text-xs px-3 py-1 rounded-md flex items-center gap-1"
                          >
                            ✏ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTodo(todo.task_id)}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-md flex items-center gap-1"
                          >
                            🗑 Hapus
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