import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const Inbox = ({ receiverId }) => { // receiverId ከ URL ወይም ከፕሮፕስ ሊመጣ ይችላል
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const setupChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      // የድሮ መልእክቶችን ማምጣት
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      setMessages(data || []);

      // --- REALTIME SUBSCRIPTION ---
      const channel = supabase
        .channel('live-chat')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        })
        .subscribe();

      return () => supabase.removeChannel(channel);
    };

    setupChat();
  }, [receiverId]);

  // መልእክት ሲላክ ስክሮሉን ወደ ታች ዝቅ ለማድረግ
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const { error } = await supabase.from('messages').insert([
      { sender_id: currentUser.id, receiver_id: receiverId, content: newMessage }
    ]);

    if (!error) setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-900/40 border border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-xl">
      {/* Chat Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/60">
        <h3 className="text-gold-500 font-black italic uppercase text-xs tracking-[0.2em]">Secure Terminal Chat</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-4 rounded-2xl text-sm font-medium italic ${
              msg.sender_id === currentUser?.id 
              ? 'bg-gold-500 text-slate-950 rounded-tr-none' 
              : 'bg-slate-800 text-white rounded-tl-none border border-slate-700'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-6 bg-slate-950/80 border-t border-slate-800 flex gap-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your elite proposal..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-6 py-3 text-white focus:border-gold-500 outline-none italic text-sm transition-all"
        />
        <button type="submit" className="bg-gold-500 hover:bg-white text-slate-950 px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-gold-500/10">
          Send
        </button>
      </form>
    </div>
  );
};

export default Inbox;