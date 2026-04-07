import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const MyPostings = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [proposals, setProposals] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching jobs:', error);
    else setMyJobs(jobs);
    setLoading(false);
  };

  const fetchProposalsForJob = async (jobId) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
      return;
    }

    const { data, error } = await supabase
      .from('proposals')
      .select(`
        id,
        cover_letter,
        status,
        freelancer_id,
        created_at,
        profiles (full_name, bio)
      `)
      .eq('job_id', jobId);

    if (error) console.error('Error fetching proposals:', error);
    else {
      setProposals({ ...proposals, [jobId]: data });
      setExpandedJob(jobId);
    }
  };

  // ኖቲፊኬሽን ወደ ዳታቤዝ ለመላክ
  const createNotification = async (userId, msg) => {
    await supabase.from('notifications').insert([
      { user_id: userId, message: msg }
    ]);
  };

  // የፕሮፖዛል ሁኔታን ለመቀየር (Hire/Decline)
  const updateProposalStatus = async (proposalId, jobId, newStatus, freelancerId) => {
    const { error } = await supabase
      .from('proposals')
      .update({ status: newStatus })
      .eq('id', proposalId);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert(`Proposal ${newStatus}! ✨`);
      
      // ፍሪላንሰሩ ከተቀጠረ ኖቲፊኬሽን ላክለት
      if (newStatus === 'accepted') {
        await createNotification(freelancerId, "Congratulations! You have been hired for a project. ✨");
      }
      
      // ዳታውን አድስ
      fetchProposalsForJob(jobId);
    }
  };

  if (loading) return <div className="p-20 text-gold-500 font-black italic animate-pulse text-center">Loading Your Postings...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h2 className="text-4xl font-black italic text-white mb-2 uppercase tracking-tighter">
          Manage <span className="text-gold-500">My Postings</span>
        </h2>
        <p className="text-slate-500 font-medium italic">Review applications and hire the best elite talent.</p>
      </div>

      {myJobs.length === 0 ? (
        <div className="text-center py-32 border border-dashed border-slate-900 rounded-[3rem]">
          <p className="text-slate-600 italic font-bold tracking-widest uppercase text-[10px] mb-8">You haven't posted any jobs yet.</p>
          <Link to="/post-job" className="bg-gold-500 text-slate-950 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all">
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {myJobs.map((job) => (
            <div key={job.id} className="bg-slate-900/30 border border-slate-800 rounded-[2.5rem] overflow-hidden transition-all hover:border-slate-700">
              <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gold-500 bg-gold-500/5 px-3 py-1 rounded-md border border-gold-500/10 italic">
                      {job.category}
                    </span>
                    <span className="text-slate-500 text-[10px] font-bold italic uppercase tracking-tighter">
                      Budget: ${job.budget}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 italic">{job.title}</h3>
                </div>
                
                <button 
                  onClick={() => fetchProposalsForJob(job.id)}
                  className="bg-slate-950 border border-slate-800 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:border-gold-500 hover:text-gold-500 transition-all"
                >
                  {expandedJob === job.id ? 'Hide Applicants' : 'View Applicants'}
                </button>
              </div>

              {expandedJob === job.id && (
                <div className="bg-slate-950/50 border-t border-slate-800 p-8 space-y-6">
                  <h4 className="text-gold-500 font-black italic uppercase text-[10px] tracking-[0.2em] mb-4">Received Proposals</h4>
                  
                  {!proposals[job.id] || proposals[job.id].length === 0 ? (
                    <p className="text-slate-600 italic text-sm">No applications received yet.</p>
                  ) : (
                    proposals[job.id].map((prop) => (
                      <div key={prop.id} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-white font-black italic">{prop.profiles?.full_name || 'Elite Freelancer'}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase italic">{new Date(prop.created_at).toLocaleDateString()}</p>
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md ${
                            prop.status === 'accepted' ? 'bg-green-500/10 text-green-500' : 
                            prop.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-gold-500/10 text-gold-500'
                          }`}>
                            {prop.status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm italic mb-6 leading-relaxed">{prop.cover_letter}</p>
                        
                        {prop.status === 'pending' && (
                          <div className="flex gap-4">
                            <button 
                              onClick={() => updateProposalStatus(prop.id, job.id, 'accepted', prop.freelancer_id)}
                              className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-black uppercase text-[9px] tracking-widest transition-all"
                            >
                              Hire
                            </button>
                            <button 
                              onClick={() => updateProposalStatus(prop.id, job.id, 'rejected', prop.freelancer_id)}
                              className="bg-slate-800 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-black uppercase text-[9px] tracking-widest transition-all"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPostings;