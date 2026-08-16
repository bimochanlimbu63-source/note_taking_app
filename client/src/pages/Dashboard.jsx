import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { LogOut, Plus, Pin, Pencil, Trash2, Search, X, NotebookPen, Loader2 } from 'lucide-react';

function timeAgo(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await axios.get('notes');
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`notes/${editingId}`, { title, content });
      } else {
        await axios.post('notes', { title, content });
      }
      resetForm();
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await axios.delete(`notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePin = async (note) => {
    try {
      await axios.put(`notes/${note._id}`, { pinned: !note.pinned });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
            <NotebookPen size={18} />
          </div>
          <h1 className="text-lg font-semibold text-slate-800">Note Taking App</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">Hi, {user?.name}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-sm text-slate-700 border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-100 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none transition-shadow focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
            />
          </div>
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className="flex items-center gap-1.5 bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'New Note'}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-slate-200 rounded-xl p-4 mb-6 space-y-3 shadow-sm"
          >
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none transition-shadow focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none transition-shadow focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-slate-600 px-4 py-2 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                {editingId ? 'Save Changes' : 'Add Note'}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 size={28} className="animate-spin mb-3" />
            <p className="text-sm">Loading notes...</p>
          </div>
        ) : sortedNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <NotebookPen size={36} className="mb-3" />
            <p className="text-sm">
              {search ? 'No notes match your search.' : 'No notes yet. Add your first note.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedNotes.map((note) => (
              <div
                key={note._id}
                className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-start hover:shadow-md transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {note.pinned && <Pin size={14} className="text-indigo-600 shrink-0" fill="currentColor" />}
                    <h3 className="font-medium text-slate-800 truncate">{note.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{note.content}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {note.updatedAt && note.updatedAt !== note.createdAt
                      ? `Edited ${timeAgo(note.updatedAt)}`
                      : `Created ${timeAgo(note.createdAt)}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 ml-3 shrink-0">
                  <button
                    onClick={() => handleTogglePin(note)}
                    title={note.pinned ? 'Unpin' : 'Pin'}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                  >
                    <Pin size={16} fill={note.pinned ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => handleEdit(note)}
                    title="Edit"
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    title="Delete"
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}