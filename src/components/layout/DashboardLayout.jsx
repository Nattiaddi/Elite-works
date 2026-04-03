import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import toast from 'react-hot-toast';

const DashboardLayout = ({ userRole }) => {
  useEffect(() => {
    // 1. የገቡትን ተጠቃሚ መታወቂያ (ID) ማግኘት
    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 2. በሪልታይም አዲስ ኖቲፊኬሽን ሲመጣ መስማት (Listen)
      const channel = supabase
        .channel('db-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            // አዲስ ዳታ ሲገባ በToast ማሳየት
            toast.success(payload.new.message, {
              icon: '🔔',
              duration: 6000,
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtime();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar ወይም Navbar እዚህ ጋር ይኖራል */}
      <nav className="p-4 border-b border-[#d4af37]/20 flex justify-between">
        <h1 className="text-[#d4af37] font-bold text-xl">Elite Works</h1>
        <span className="text-xs bg-[#d4af37]/10 text-[#d4af37] px-2 py-1 rounded">
          {userRole}
        </span>
      </nav>

      <main className="p-6">
        {/* የገጾቹ ይዘት እዚህ ጋር ይወጣል */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;