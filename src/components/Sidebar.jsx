import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  LayoutDashboard, 
  Briefcase, 
  Search, 
  PlusCircle, 
  User, 
  MessageSquare,
  ShieldAlert,
  Wallet
} from 'lucide-react';

const Sidebar = () => {
  const [profile, setProfile] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        setProfile(data);
      }
    };
    fetchProfile();
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Manage Projects', icon: Briefcase, path: '/manage-projects' },
    { name: 'Messages', icon: MessageSquare, path: '/messages' },
    { name: 'Wallet', icon: Wallet, path: '/wallet' },
    { name: 'My Profile', icon: User, path: '/profile' },
  ];

  const roleLinks = profile?.user_role === 'client' 
    ? [{ name: 'Post a Job', icon: PlusCircle, path: '/post-job' }]
    : [{ name: 'Find Work', icon: Search, path: '/find-jobs' }];

  const adminLinks = profile?.user_role === 'admin' 
    ? [{ name: 'Admin Command', icon: ShieldAlert, path: '/admin-command' }] 
    : [];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 min-h-screen bg-slate-950 border-r border-white/5 p-6 hidden lg:flex flex-col sticky top-0">
      <div className="mb-12 px-2 text-left">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 italic">Menu</h2>
      </div>

      <nav className="flex-grow space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black uppercase italic text-[10px] tracking-widest transition-all ${
              isActive(item.path)
                ? 'bg-gold-500 text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}

        {adminLinks.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/5">
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-red-500 italic mb-4 px-2 text-left">Control</h2>
            {adminLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black uppercase italic text-[10px] tracking-widest transition-all ${
                  isActive(item.path)
                    ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.2)]'
                    : 'text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-dashed border-red-500/20'
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/5">
          <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 italic mb-4 px-2 text-left">Action</h2>
          {roleLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-black uppercase italic text-[10px] tracking-widest transition-all ${
                isActive(item.path)
                  ? 'bg-gold-500 text-slate-950 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-dashed border-white/10'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      <div className="mt-auto bg-white/5 rounded-[2rem] p-4 border border-white/5">
        <div className="flex items-center gap-3 mb-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center text-slate-950 font-black text-xs">
            {profile?.full_name?.charAt(0) || 'E'}
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-black text-white truncate uppercase italic">
              {profile?.full_name || 'Elite User'}
            </p>
            <p className="text-[8px] text-gold-500/70 font-bold uppercase tracking-tighter italic">
              {profile?.user_role || 'User'}
            </p>
          </div>
        </div>
        <Link to="/wallet" className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-tighter border-t border-white/5 pt-3 hover:text-gold-500 transition-colors">
          <span>Balance</span>
          <span className="text-white font-black italic">${profile?.balance || 0}</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;