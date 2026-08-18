import React from 'react';
import { useForm } from 'react-hook-form';
import MainLayout from '../../components/MainLayout';

export default function CreateAssessment() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log('Assessment Config:', data);
    alert('Assessment Created Successfully!');
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-6">
        <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Create New Assessment</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">Title</label>
            <input
              {...register('title', { required: true })}
              className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500 text-sm"
              placeholder="e.g. Node.js Backend Engineer Test"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Duration (Minutes)</label>
              <input
                type="number"
                {...register('durationMinutes')}
                className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500 text-sm"
                placeholder="30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Passing Marks (%)</label>
              <input
                type="number"
                {...register('passingMarks')}
                className="w-full mt-1 p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500 text-sm"
                placeholder="60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2">
            <label className="flex items-center space-x-3 text-sm text-slate-300">
              <input type="checkbox" {...register('negativeMarking')} className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0" />
              <span>Enable Negative Marking</span>
            </label>
            <label className="flex items-center space-x-3 text-sm text-slate-300">
              <input type="checkbox" {...register('shuffleQuestions')} className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0" />
              <span>Shuffle Questions</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition text-sm"
          >
            Publish Assessment
          </button>
        </form>
      </div>
    </MainLayout>
  );
}