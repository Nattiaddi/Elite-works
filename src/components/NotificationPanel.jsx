// Notifications Component (Simple implementation)
const NotificationPanel = ({ userId }) => {
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    // 1. Initial Fetch
    const fetchNotifs = async () => {
      const { data } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      setNotifs(data || []);
    };
    fetchNotifs();

    // 2. Real-time Subscription
    const channel = supabase.channel('realtime_notifs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, 
      (payload) => {
        setNotifs(prev => [payload.new, ...prev]);
        // እዚህ ጋር የድምፅ ማሳሰቢያ መጨመር ትችላለህ
      }).subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId]);

  return (
    <div className="absolute right-0 mt-4 w-80 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl p-4 z-50 overflow-hidden">
      <h4 className="text-[10px] font-black uppercase italic tracking-[0.2em] text-gold-500 mb-4 px-2">Alert Center</h4>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
        {notifs.length === 0 ? (
          <p className="text-slate-600 text-[10px] uppercase font-black italic text-center py-4">No new alerts</p>
        ) : (
          notifs.map(n => (
            <div key={n.id} className="bg-white/5 p-3 rounded-xl border-l-2 border-gold-500 text-[11px] italic">
              {n.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
};