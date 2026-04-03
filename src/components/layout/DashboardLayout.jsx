import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import toast from 'react-hot-toast';

const DashboardLayout = ({ userRole }) => {
  useEffect(() => {
    const setupRealtime = async () => {
      // 1. የተጠቃሚውን መረጃ ማግኘት
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("ተጠቃሚ አልተገኘም - Login መደረጉን ያረጋግጡ");
        return;
      }

      // 2. ID-ህን በConsole ላይ ያወጣዋል (ይህንን ኮፒ አድርገህ ለSQL ሙከራ ተጠቀመው)
      console.log("የእኔ User ID:", user.id);

      // 3. Realtime ግንኙነት መፍጠር
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
            // አዲስ ኖቲፊኬሽን ሲመጣ የሚታይ Toast
            toast.success(payload.new.message || 'አዲስ መልዕክት አለዎት', {
              icon: '🔔',
              duration: 6000,
              style: {
                background: '#111',
                color: '#d4af37',
                border: '1px solid #d4af37',
              }
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
      {/* Navigation Bar */}
      <nav className="p-4 border-b border-[#d4af37]/20 flex justify-between items-center">
        <h1 className="text-[#d4af37] font-bold text-xl tracking-wider">ELITE WORKS</h1>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase border border-[#d4af37]/40 text-[#d4af37] px-2 py-1 rounded">
            {userRole}
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;