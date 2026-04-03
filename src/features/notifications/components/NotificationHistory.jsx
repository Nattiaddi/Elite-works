import React, { useEffect, useState } from 'react';
import { supabase } from '../../../config/supabase';

const NotificationHistory = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error) setNotifications(data);
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  if (loading) return <div className="text-[#d4af37] text-center mt-10">በመጫን ላይ...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold text-[#d4af37] mb-6 border-b border-[#d4af37]/20 pb-2">
        የማሳወቂያዎች ታሪክ
      </h2>
      
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500">ምንም ማሳወቂያ የለም።</p>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={`p-4 rounded-lg border bg-[#111] transition-all hover:border-[#d4af37]/50 ${
                n.is_read ? 'border-gray-800 opacity-70' : 'border-[#d4af37]/30 shadow-[0_0_10px_rgba(212,175,55,0.1)]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[#d4af37] font-semibold">{n.title}</h3>
                  <p className="text-gray-300 text-sm mt-1">{n.message}</p>
                </div>
                <span className="text-[10px] text-gray-500">
                  {new Date(n.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationHistory;