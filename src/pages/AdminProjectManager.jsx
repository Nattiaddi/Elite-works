import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { FolderOpen, FileText, Trash2, ExternalLink, User, Calendar, Tag } from 'lucide-react';

const AdminProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    // ፕሮጀክቶችን ከነ ባለቤታቸው (Profiles) ጋር ያመጣል
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        profiles:client_id (full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (!error) setProjects(data);
    setLoading(false);
  };

  const handleDeleteProject = async (projectId) => {
    const confirm = window.confirm("Are you sure you want to delete this project and all its assets?");
    if (confirm) {
      const { error } = await supabase.from('projects').delete().eq('id', projectId);
      if (!error) fetchProjects();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Project <span className="text-gold-500">Archive</span></h2>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 italic">Monitor and manage all active marketplace assets</p>
        </div>
        <div className="bg-gold-500/10 border border-gold-500/20 px-4 py-2 rounded-xl">
          <span className="text-gold-500 text-xs font-black italic">{projects.length} Total Projects</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center py-20 text-gold-500 font-black italic uppercase animate-pulse">Scanning Database Assets...</p>
        ) : projects.length === 0 ? (
          <div className="col-span-full bg-slate-900/20 border border-slate-800 rounded-[3rem] p-20 text-center">
            <FolderOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-black italic uppercase text-xs">No projects uploaded yet.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-6 hover:border-gold-500/30 transition-all flex flex-col group">
              {/* Project Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-gold-500">
                  <FileText className="w-5 h-5" />
                </div>
                <button 
                  onClick={() => handleDeleteProject(project.id)}
                  className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-sm font-black italic uppercase text-white mb-2 line-clamp-1 group-hover:text-gold-500 transition-colors">
                {project.title}
              </h3>
              
              <p className="text-[10px] text-slate-500 font-medium italic mb-6 line-clamp-2 leading-relaxed">
                {project.description}
              </p>

              {/* Meta Info */}
              <div className="mt-auto space-y-3">
                <div className="flex items-center gap-3 text-slate-400">
                  <User className="w-3 h-3 text-gold-500" />
                  <span className="text-[9px] font-black uppercase italic tracking-tighter">
                    {project.profiles?.full_name || 'Unknown Client'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3 text-slate-600" />
                    <span className="text-[10px] font-black italic text-gold-500">${project.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[8px] font-bold italic">{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* View Files Button */}
                <button className="w-full mt-4 bg-slate-950 border border-slate-800 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-gold-500/50 transition-all flex items-center justify-center gap-2">
                  <ExternalLink className="w-3 h-3" /> View Project Assets
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminProjectManager;