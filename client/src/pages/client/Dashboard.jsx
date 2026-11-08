import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Pencil, Check, X, LogOut, Loader2, ArrowUpRight, ArrowRight, Search, ListTodo, CircleCheck, Circle, Asterisk, SlidersHorizontal } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useTodoStore from '../../store/useTodoStore';
import useToast from '../../hooks/useToast';
import Brand from '../../components/Brand';

function TodoItem({ todo, onToggle, onUpdate, onDelete, index }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const inputRef = useRef(null);
  const saving = useRef(false);
  const [busy, setBusy] = useState(false);
  const save = async () => {
    if (saving.current) return;
    const title = draft.trim();
    if (!title || title === todo.title) { setEditing(false); return; }
    saving.current = true; setBusy(true);
    const success = await onUpdate(todo._id, { title });
    if (success) setEditing(false);
    saving.current = false; setBusy(false);
  };
  const edit = () => { setDraft(todo.title); setEditing(true); requestAnimationFrame(() => inputRef.current?.focus()); };
  return <div className={`task-row ${todo.completed ? 'is-complete' : ''}`}>
    <button className="task-check" aria-label={`${todo.completed ? 'Mark incomplete' : 'Complete'}: ${todo.title}`} aria-pressed={todo.completed} onClick={() => onToggle(todo._id, !todo.completed)}>{todo.completed && <Check size={15} strokeWidth={3} />}</button>
    <div className="task-title">{editing ? <input ref={inputRef} aria-label="Edit task title" value={draft} disabled={busy} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }} /> : <span>{todo.title}</span>}</div>
    <span className="task-status">{todo.completed ? 'Done' : 'To do'}</span>
    <div className="task-actions">{editing ? <><button aria-label="Save task" disabled={busy} onClick={save}>{busy ? <Loader2 className="spin" size={16} /> : <Check size={16} />}</button><button aria-label="Cancel editing" disabled={busy} onClick={() => setEditing(false)}><X size={16} /></button></> : <><button aria-label={`Edit ${todo.title}`} onClick={edit}><Pencil size={15} /></button><button className="delete-task" aria-label={`Delete ${todo.title}`} onClick={() => onDelete(todo._id)}><Trash2 size={15} /></button></>}</div>
    <span className="task-index">{String(index + 1).padStart(2, '0')}</span>
  </div>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, Logout: logout, GetProfile: getProfile } = useAuthStore();
  const { todos, isLoading, isAdding, fetchTodos, addTodo, updateTodo, deleteTodo } = useTodoStore();
  const [newTitle, setNewTitle] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loadError, setLoadError] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    if (!user) getProfile().catch(console.error);
    fetchTodos().catch(() => setLoadError(true));
  }, [fetchTodos, getProfile, user]);
  const handleAdd = async (e) => {
    e.preventDefault(); if (!newTitle.trim()) return;
    try { await addTodo(newTitle.trim()); setNewTitle(''); inputRef.current?.focus(); }
    catch { toast.error('Failed to add task.'); }
  };
  const handleUpdate = async (id, updates) => {
    try { await updateTodo(id, updates); return true; }
    catch { toast.error('Failed to save changes.'); return false; }
  };
  const handleDelete = async (id) => { try { await deleteTodo(id); toast.success('Task deleted.'); } catch { toast.error('Failed to delete task.'); } };
  const handleLogout = async () => {
    setLoggingOut(true);
    try { await logout(); navigate('/login'); } catch { toast.error('Logout failed.'); } finally { setLoggingOut(false); }
  };
  const completed = todos.filter((todo) => todo.completed).length;
  const remaining = todos.length - completed;
  const progress = todos.length ? Math.round(completed / todos.length * 100) : 0;
  const filtered = todos.filter((todo) => (filter === 'all' || (filter === 'completed' ? todo.completed : !todo.completed)) && todo.title.toLowerCase().includes(search.toLowerCase())).sort((a, b) => Number(a.completed) - Number(b.completed));
  const views = [{ id: 'all', label: 'All tasks', icon: ListTodo, count: todos.length }, { id: 'active', label: 'In progress', icon: Circle, count: remaining }, { id: 'completed', label: 'Completed', icon: CircleCheck, count: completed }];
  const date = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
  const name = user?.firstName || 'friend';
  return <div className="workspace">
    <aside className="sidebar"><Brand /><div className="workspace-label"><span className="workspace-avatar">P</span><div>Personal workspace<small>A little space for your plans</small></div></div>
      <span className="nav-caption">WORKSPACE</span><nav aria-label="Task views">{views.map(({ id, label, icon: Icon, count }) => <button key={id} className={`nav-item ${filter === id ? 'active' : ''}`} onClick={() => setFilter(id)}><Icon size={19} /><span>{label}</span><small>{count}</small></button>)}</nav>
      <div className="sidebar-note"><Asterisk size={30} strokeWidth={1.5} /><h3>One thing<br />at a time.</h3><p>You don’t have to do it all.<br />Just the next thing.</p><span>A LITTLE DAILY REMINDER ↗</span></div>
      <div className="sidebar-user"><span className="user-avatar">{name[0].toUpperCase()}</span><div>{user?.firstName || 'Your workspace'}<small>Personal account</small></div><button className="icon-button" onClick={handleLogout} disabled={loggingOut} aria-label="Log out">{loggingOut ? <Loader2 className="spin" size={18} /> : <LogOut size={18} />}</button></div>
    </aside>
    <div className="workspace-main"><header className="topbar"><span>Workspace <span className="breadcrumb-slash">/</span> <strong>My tasks</strong></span><span className="today-date">{date}</span><span className="mobile-avatar">{name[0].toUpperCase()}</span></header>
      <main className="dashboard-content"><div className="page-heading"><div><span className="eyebrow orange-text">A FRESH PAGE, EVERY DAY</span><h1>A little focus.<br /><em>A lot of possibility.</em></h1><p>Hey {name}, let’s make space for a good day.</p></div><div className="heading-art" aria-hidden="true"><div className="art-sun"><Asterisk /></div><ArrowUpRight className="art-arrow" strokeWidth={1.1} /><span>MAKE IT HAPPEN.</span></div></div>
      <div className="dashboard-grid"><section className="tasks-panel" aria-label="Your tasks"><div className="section-heading"><h2>Your daily edit<span>{todos.length}</span></h2><span className="quiet-label">SMALL STEPS. REAL PROGRESS.</span></div>
        <form className="add-task" onSubmit={handleAdd}><Plus size={20} /><input ref={inputRef} aria-label="New task title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="What’s on your mind?" /><button className="primary-button" disabled={isAdding || !newTitle.trim()}>{isAdding ? <Loader2 className="spin" size={17} /> : <><span>Add task</span><ArrowUpRight size={17} /></>}</button></form>
        <div className="list-toolbar"><div className="task-tabs" aria-label="Filter tasks">{views.map(({ id, count }) => <button key={id} aria-pressed={filter === id} className={filter === id ? 'selected' : ''} onClick={() => setFilter(id)}>{id === 'all' ? 'All tasks' : id === 'active' ? 'Active' : 'Done'}<span>{count}</span></button>)}</div><label className="task-search"><Search size={16} /><input aria-label="Search tasks" placeholder="Search tasks" value={search} onChange={(e) => setSearch(e.target.value)} /></label></div>
        <div className="task-list">{isLoading ? <div className="list-state" role="status"><Loader2 className="spin" />Loading your tasks…</div> : loadError ? <div className="list-state"><p>We couldn’t load your tasks.</p><button className="text-button" onClick={() => { setLoadError(false); fetchTodos().catch(() => setLoadError(true)); }}>Try again <ArrowRight size={16} /></button></div> : filtered.length ? filtered.map((todo, index) => <TodoItem key={todo._id} todo={todo} index={index} onToggle={(id, value) => handleUpdate(id, { completed: value })} onUpdate={handleUpdate} onDelete={handleDelete} />) : <div className="empty-state"><div className="empty-illustration"><ListTodo size={35} strokeWidth={1.3} /><span>✦</span></div><h3>{search ? 'Nothing by that name.' : filter === 'completed' ? 'Good things take a first step.' : filter === 'active' && todos.length ? 'Look at you. All caught up.' : 'Big plans start small.'}</h3><p>{search ? 'Try a different search to find your task.' : filter === 'completed' ? 'Your completed tasks will find a home here.' : filter === 'active' && todos.length ? 'Take a breath. You’ve earned a little pause.' : 'Add your first task. Get it out of your head and onto the page.'}</p>{!search && filter !== 'completed' && <button className="text-button" onClick={() => inputRef.current?.focus()}>Write something down <ArrowRight size={16} /></button>}</div>}</div>
        <div className="list-footer"><span><SlidersHorizontal size={13} /> Your list, at your pace.</span><span>{remaining} {remaining === 1 ? 'task' : 'tasks'} to go</span></div>
      </section>
      <aside className="right-rail"><section className="progress-card"><div className="card-eyebrow">THE BIG PICTURE <ArrowUpRight size={18} /></div><h2>Look at you go.</h2><p>Every little check counts.</p><div className="progress-ring" style={{ '--progress': `${progress}%` }}><div><strong>{progress}<span>%</span></strong><small>COMPLETE</small></div></div><div className="progress-stats"><div><strong>{remaining.toString().padStart(2, '0')}</strong><span>To do</span></div><div><strong>{completed.toString().padStart(2, '0')}</strong><span>Done & dusted</span></div></div><div className="card-bottom">{progress === 100 && todos.length ? 'A clean slate. Nicely done.' : 'Progress over perfection. Always.'}</div></section>
      <section className="daily-note"><span className="eyebrow">NOTE TO SELF</span><h3>Doing less,<br /><em>but better.</em></h3><p>Give your attention to the things that deserve it.</p><div><span>YOU’VE GOT THIS</span><Asterisk size={31} strokeWidth={1.4} /></div></section></aside></div>
      <footer className="dashboard-footer"><span>Less busy. More intentional.</span><span>MADE FOR YOUR EVERYDAY ↗</span></footer>
      </main></div>
  </div>;
}
