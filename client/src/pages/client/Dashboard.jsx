import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useTodoStore from '../../store/useTodoStore';
import useToast from '../../hooks/useToast';
import {
    CheckSquare,
    Plus,
    Trash2,
    Pencil,
    Check,
    X,
    LogOut,
    Loader2,
    ClipboardList,
} from 'lucide-react';

const TodoItem = ({ todo, onToggle, onUpdate, onDelete }) => {
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(todo.title);
    const inputRef = useRef(null);

    const startEdit = () => {
        setDraft(todo.title);
        setEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const cancelEdit = () => {
        setDraft(todo.title);
        setEditing(false);
    };

    const saveEdit = () => {
        const trimmed = draft.trim();
        if (!trimmed) return cancelEdit();
        if (trimmed !== todo.title) onUpdate(todo._id, { title: trimmed });
        setEditing(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') saveEdit();
        if (e.key === 'Escape') cancelEdit();
    };

    return (
        <div className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-200 ${
            todo.completed
                ? 'bg-gray-50 border-gray-100'
                : 'bg-white border-gray-200 hover:border-indigo-200 hover:shadow-sm'
        }`}>
            {/* Checkbox */}
            <button
                onClick={() => onToggle(todo._id, !todo.completed)}
                className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                    todo.completed
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-gray-300 hover:border-indigo-400'
                }`}
            >
                {todo.completed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </button>

            {/* Title / Edit input */}
            <div className="flex-1 min-w-0">
                {editing ? (
                    <input
                        ref={inputRef}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={saveEdit}
                        className="w-full text-sm text-gray-900 bg-transparent border-b-2 border-indigo-500 outline-none py-0.5"
                    />
                ) : (
                    <span className={`text-sm leading-relaxed truncate block ${
                        todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}>
                        {todo.title}
                    </span>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                {editing ? (
                    <>
                        <button
                            onClick={saveEdit}
                            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition"
                            title="Save"
                        >
                            <Check className="w-4 h-4" />
                        </button>
                        <button
                            onClick={cancelEdit}
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition"
                            title="Cancel"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={startEdit}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                            title="Edit"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(todo._id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { user, Logout: logout, GetProfile: getProfile } = useAuthStore();
    const { todos, isLoading, isAdding, fetchTodos, addTodo, updateTodo, deleteTodo } = useTodoStore();

    const [newTitle, setNewTitle] = useState('');
    const [loggingOut, setLoggingOut] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!user) getProfile().catch(console.error);
        fetchTodos().catch(console.error);
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        const trimmed = newTitle.trim();
        if (!trimmed) return;
        try {
            await addTodo(trimmed);
            setNewTitle('');
            inputRef.current?.focus();
        } catch {
            toast.error('Failed to add todo.');
        }
    };

    const handleToggle = async (id, completed) => {
        try {
            await updateTodo(id, { completed });
        } catch {
            toast.error('Failed to update todo.');
        }
    };

    const handleUpdate = async (id, updates) => {
        try {
            await updateTodo(id, updates);
        } catch {
            toast.error('Failed to save changes.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTodo(id);
            toast.success('Todo deleted.');
        } catch {
            toast.error('Failed to delete todo.');
        }
    };

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
            toast.success('Logged out. See you soon!');
            navigate('/login');
        } catch {
            toast.error('Logout failed.');
        } finally {
            setLoggingOut(false);
        }
    };

    const completedCount = todos.filter((t) => t.completed).length;
    const total = todos.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/40">
                            <CheckSquare className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg leading-none">TodoFlow</h1>
                            {user && (
                                <p className="text-indigo-300 text-xs mt-0.5">
                                    Hey, {user.firstName}!
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex items-center gap-1.5 text-indigo-300 hover:text-white text-sm font-medium transition px-3 py-1.5 rounded-lg hover:bg-white/10 disabled:opacity-50"
                    >
                        {loggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                        Logout
                    </button>
                </div>

                {/* Stats bar */}
                {total > 0 && (
                    <div className="mb-5 bg-white/5 backdrop-blur rounded-2xl px-5 py-3.5 flex items-center gap-4 border border-white/10">
                        <div className="flex-1">
                            <div className="flex items-center justify-between text-xs text-indigo-300 mb-1.5">
                                <span>{completedCount} of {total} done</span>
                                <span>{Math.round((completedCount / total) * 100)}%</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                                    style={{ width: `${(completedCount / total) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Add todo form */}
                <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                    <input
                        ref={inputRef}
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Add a new todo…"
                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-indigo-300/60 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent backdrop-blur transition"
                    />
                    <button
                        type="submit"
                        disabled={isAdding || !newTitle.trim()}
                        className="flex items-center gap-1.5 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-900/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add
                    </button>
                </form>

                {/* Todo list */}
                <div className="space-y-2">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                        </div>
                    ) : todos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
                                <ClipboardList className="w-8 h-8 text-indigo-400" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-1">No todos yet</h3>
                            <p className="text-indigo-300 text-sm">Add your first task above to get started.</p>
                        </div>
                    ) : (
                        <>
                            {/* Pending todos */}
                            {todos.filter((t) => !t.completed).map((todo) => (
                                <TodoItem
                                    key={todo._id}
                                    todo={todo}
                                    onToggle={handleToggle}
                                    onUpdate={handleUpdate}
                                    onDelete={handleDelete}
                                />
                            ))}

                            {/* Completed section */}
                            {completedCount > 0 && (
                                <div className="pt-4">
                                    <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2 px-1">
                                        Completed ({completedCount})
                                    </p>
                                    {todos.filter((t) => t.completed).map((todo) => (
                                        <TodoItem
                                            key={todo._id}
                                            todo={todo}
                                            onToggle={handleToggle}
                                            onUpdate={handleUpdate}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
