import React, { useEffect, useState } from 'react';
import { supabase } from '../../../config/supabase';

const JobFeed = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data } = await supabase
        .from('jobs')
        .select('*, profiles(full_name)')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      setJobs(data);
    };
    fetchJobs();
  }, []);

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div key={job.id} className="bg-obsidian-soft border border-white/10 p-6 rounded-2xl hover:border-gold/30 transition-all cursor-pointer">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-white">{job.title}</h3>
            <span className="text-gold font-bold">${job.budget_min} - ${job.budget_max}</span>
          </div>
          <p className="text-gray-400 mt-2 line-clamp-2">{job.description}</p>
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 uppercase tracking-widest">
            <span>Posted by {job.profiles?.full_name}</span>
            <span>•</span>
            <span>{job.category}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobFeed;