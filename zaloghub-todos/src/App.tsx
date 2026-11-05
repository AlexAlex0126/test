import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

type Filter = 'all' | 'active' | 'completed';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('zaloghub_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    localStorage.setItem('zaloghub_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: input.trim(), completed: false }]);
    setInput('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif', padding: 20 }}>
      <h2>Список задач (ZalogHub)</h2>
      <form onSubmit={addTask} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Новая задача..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Добавить</button>
      </form>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setFilter('all')} style={{ fontWeight: filter === 'all' ? 'bold' : 'normal' }}>Все</button>
        <button onClick={() => setFilter('active')} style={{ fontWeight: filter === 'active' ? 'bold' : 'normal' }}>Активные</button>
        <button onClick={() => setFilter('completed')} style={{ fontWeight: filter === 'completed' ? 'bold' : 'normal' }}>Выполненные</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTasks.map(t => (
          <li key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, background: '#f9f9f9', padding: 8, borderRadius: 4 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: t.completed ? 'line-through' : 'none', color: t.completed ? '#888' : '#000', cursor: 'pointer' }}>
              <input type="checkbox" checked={t.completed} onChange={() => toggleTask(t.id)} />
              {t.text}
            </label>
            <button onClick={() => deleteTask(t.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Удалить</button>
          </li>
        ))}
        {filteredTasks.length === 0 && <p style={{ color: '#888', textAlign: 'center' }}>Нет задач</p>}
      </ul>
    </div>
  );
}