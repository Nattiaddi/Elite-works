import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../config/supabase';
import { Send, User } from 'lucide-react';

const ChatWindow = ({ jobId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    // 1. የአሁኑን ተጠቃሚ አምጣ
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      fetchMessages(user.id);
    };
    getUser();

    // 2. Real-time Subscription (መልእክት ሲመጣ ወዲያውኑ እንዲታይ)
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchMessages = async (userId) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const { error } = await supabase.from('messages').insert([
      {
        sender_id: currentUser.id,
        receiver_id: receiverId,
        job_id: jobId,
        content: newMessage
      }
    ]);

    if (!error) setNewMessage('');
  };

  // አዲስ መልእክት ሲመጣ ወደ ታች Scroll ያደርጋል
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[600px] bg-obsidian-soft border border-white/5 rounded-3xl overflow-hidden">
      {/* Chat Header */}
      <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gold-gradient"></div>
        <h3 className="font-bold text-white">Elite Discussion</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${
              msg.sender_id === currentUser?.id 
                ? 'bg-gold text-black font-medium rounded-tr-none' 
                : 'bg-obsidian border border-white/10 text-gray-300 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-6 bg-obsidian border-t border-white/5 flex gap-4">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type an elite response..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-gold transition-all"
        />
        <button 
          type="submit" 
          className="bg-gold text-black p-3 rounded-xl hover:bg-gold-dark transition-all"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;