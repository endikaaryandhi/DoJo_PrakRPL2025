import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
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
  const [sortOrder, setSortOrder] = useState('none');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hiddenCategories, setHiddenCategories] = useState(new Set()); // State for hidden categories
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
  }, [navigate]);

  const fetchTodos = useCallback(async () => {
    if (!user) return;
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
  }, [user]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

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

  const handleCheckboxChange = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    const { error } = await supabase
      .from('task')
      .update({ status: newStatus })
      .eq('task_id', taskId);

    if (error) {
      toast.error(`Gagal memperbarui status todo! Error: ${error.message}`);
    } else {
      toast.success('Status todo berhasil diperbarui!');
      fetchTodos();
    }
  };

  const toggleCategoryVisibility = (categoryName) => {
    setHiddenCategories((prev) => {
      const newHiddenCategories = new Set(prev);
      if (newHiddenCategories.has(categoryName)) {
        newHiddenCategories.delete(categoryName); // Show category
      } else {
        newHiddenCategories.add(categoryName); // Hide category
      }
      return newHiddenCategories;
    });
  };

  const sortByPriority = (a, b) => {
    const priorityOrder = { low: 3, medium: 2, high: 1 };
    const aPriority = priorityOrder[a.priority?.toLowerCase()] || 4;
    const bPriority = priorityOrder[b.priority?.toLowerCase()] || 4;

    if (sortOrder === 'asc') return aPriority - bPriority;
    if (sortOrder === 'desc') return bPriority - aPriority;
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 pt-24 pb-4">
      <Toaster />

      {/* Header */}
      <header className="w-full flex justify-between items-center px-6 py-4 bg-white shadow fixed top-0 left-0 right-0 z-50">
        <div className="text-pink-500 text-xl font-bold flex items-center gap-2">
          <img src="/assets/logo.svg" alt="Dojo" className="h-10" />
        </div>
        <Link to="/profile">
          <button type="button" className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center font-semibold text-sm text-gray-800">
            {(() => {
              const name = user?.user_metadata?.full_name;
              if (name) {
                const parts = name.trim().split(' ');
                return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
              }
              return (user?.email?.slice(0, 2) || 'PU').toUpperCase();
            })()}
          </button>
        </Link>
      </header>

      {/* Greeting */}
      <section className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Halo, {user?.user_metadata?.full_name || user?.email || 'Pengguna'}!
        </h1>
        <p className="text-gray-500">
          Hari ini, {new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}. Have a Nice Day!
        </p>
      </section>

      {/* Form + Filter + Sort */}
      <section className="mb-6">
        <AddTodoForm onTodoAdded={fetchTodos} categories={categories} userId={user?.id} />

        <div className="mt-2 flex justify-between items-center flex-wrap gap-2">
          {/* Kiri: Filter Status */}
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm bg-[#a5d8e1] text-white px-4 py-1 rounded-full shadow appearance-none cursor-pointer"
            >
              <option value="all">Semua</option>
              <option value="pending">Belum Selesai</option>
              <option value="completed">Selesai</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="text-sm bg-[#a5d8e1] text-white px-4 py-1 rounded-full shadow appearance-none cursor-pointer"
            >
              <option value="none">Urutkan: Default</option>
              <option value="asc">Prioritas: High → Low</option>
              <option value="desc">Prioritas: Low → High</option>
            </select>
          </div>

          {/* Kanan: Jumlah Tugas */}
          <div className="ml-auto w-fit bg-[#a5d8e1] text-white text-sm font-medium px-4 py-1 rounded-full shadow">
            Tugas : {todos.length}
          </div>
        </div>
      </section>

      {/* Todo List */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <section className="space-y-6">
          {categories.map((category) => {
            const filteredTodos = todos
              .filter((todo) => todo.category?.name === category.name)
              .filter((todo) =>
                statusFilter === 'all' ? true : todo.status === statusFilter
              )
              .sort(sortByPriority);

            return (
              <div key={category.category_id}>
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className="font-semibold text-gray-700 cursor-pointer"
                    onClick={() => toggleCategoryVisibility(category.name)}
                  >
                    {category.name}{' '}
                    <span className="text-sm text-gray-400">^ {filteredTodos.length}</span>
                  </h3>
                  <hr className="flex-grow ml-2 border-gray-200" />
                </div>

                {!hiddenCategories.has(category.name) && filteredTodos.length > 0 && (
                  <ul className="space-y-3">
                    {filteredTodos.map((todo) => (
                      <li key={todo.task_id} className="flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={todo.status === 'completed'}
                            onChange={() => handleCheckboxChange(todo.task_id, todo.status)}
                          />

                          <span className={`text-sm font-medium ${todo.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {todo.title}
                          </span>

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
