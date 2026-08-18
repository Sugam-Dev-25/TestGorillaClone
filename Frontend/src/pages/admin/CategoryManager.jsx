import React, { useState } from 'react';
import MainLayout from '../../components/MainLayout';
import { Plus, FolderKanban } from 'lucide-react';

export default function CategoryManager() {
  const [categories, setCategories] = useState(['JavaScript', 'React', 'Node.js', 'System Design']);
  const [newCat, setNewCat] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (newCat.trim()) {
      setCategories([...categories, newCat]);
      setNewCat('');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Assessment Categories</h1>
          <p className="text-slate-400 text-sm mt-1">Add and manage topics for recruiter assessments.</p>
        </div>

        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="text"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="e.g. MongoDB"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 text-sm"
          />
          <button type="submit" className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl text-sm flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </form>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, idx) => (
            <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center space-x-3">
              <FolderKanban className="w-5 h-5 text-indigo-400" />
              <span className="font-semibold text-slate-200 text-sm">{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}