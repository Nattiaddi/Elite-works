import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

const ChatPopup = ({ receiverId, receiverName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const scrollRef = useRef();

  // 1. የደህንነት ፍተሻ (Filter) - መልእክቱ ከመላኩ በፊት የሚመረምር
  const filterMessage = (text) => {
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}/g;
    const linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9.-]+\.(com|net|org|edu|gov|io|me|info|biz|et))/gi;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    if (phoneRegex.test(text) || linkRegex.test(text) || emailRegex.test(text)) {
      return {
        isValid: false,
        cleanedText: "Contact details are restricted for Elite security."
      };
    }
    return { isValid: true, cleanedText: text };
  };

  // ቻቱ ሲከፈት ዳታ ማምጣት
  useEffect(() => {
    if (!isOpen || !receiverId) return;

    const setupChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      setMessages(data || []);

      const channel = supabase
        .channel(`room-${receiverId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
          if (
            (payload.new.sender_id === user.id && payload.new.receiver_id === receiverId) ||
            (payload.new.sender_id === receiverId && payload.new.receiver_id === user.id)
          ) {
            setMessages((prev) => [...prev, payload.new]);
          }
        })
        .subscribe();

      return () => supabase.removeChannel(channel);
    };

    setupChat();
  }, [isOpen, receiverId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 2. መልእክት መላኪያ (ከጥበቃ ስልቱ ጋር)
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    // የደህንነት ፍተሻውን እዚህ እንጠቀማለን
    const validation = filterMessage(newMessage);
    
    if (!validation.isValid) {
      alert("Warning: Sharing phone numbers, emails, or links is strictly prohibited on Elite Works.");
      setNewMessage(''); 
      return;
    }

    const { error } = await supabase.from('messages').insert([
      { 
        sender_id: currentUser.id, 
        receiver_id: receiverId, 
        content: validation.cleanedText 
      }
    ]);

    if (!error) setNewMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 md:w-96 h-[500px] bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden mb-4 backdrop-blur-xl">
          <div className="p-5 bg-gold-500 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-gold-500 font-black italic text-xs uppercase">
                {receiverName?.charAt(0) || 'E'}
              </div>
              <span className="text-slate-950 font-black italic uppercase text-[11px] tracking-widest">{receiverName || 'Elite Partner'}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-950 font-bold text-xl">×</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-[12px] font-medium italic ${
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

          <form onSubmit={sendMessage} className="p-4 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Message..."
              className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-2 text-white text-xs outline-none italic"
            />
            <button type="submit" className="bg-gold-500 p-2 rounded-xl text-slate-950 font-black">
              →
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center shadow-xl shadow-gold-500/20 hover:scale-110 transition-all group"
      >
        {isOpen ? (
          <span className="text-slate-950 font-black text-xl italic leading-none">↓</span>
        ) : (
          <div className="relative">
             <span className="text-slate-950 font-black text-xl italic leading-none uppercase">ቀ</span>
             <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-gold-500 animate-pulse"></span>
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatPopup;