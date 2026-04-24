import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import Sidebar from '../components/Sidebar';
import { 
  Send, User, Search, MoreVertical, Paperclip, CheckCheck, 
  Phone, Video, PlusCircle, MessageSquare 
} from 'lucide-react';

const Messages = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const initChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (user) fetchChatList(user.id);
    };
    initChat();

    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    if (activeChat && currentUser) fetchMessages();
  }, [activeChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatList = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, user_role')
      .not('id', 'eq', userId); 
    setChats(data || []);
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${activeChat.id}),and(sender_id.eq.${activeChat.id},receiver_id.eq.${currentUser.id})`)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const content = newMessage;
    setNewMessage('');

    await supabase.from('messages').insert([
      { sender_id: currentUser.id, receiver_id: activeChat.id, content }
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex text-left">
      <Sidebar />
      <div className="flex-1 flex h-screen overflow-hidden">
        <div className="w-80 border-r border-white/5 flex flex-col bg-slate-900/20">
          <div className="p-8">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Messages</h1>
            <div className="relative mt-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input type="text" placeholder="Search chats..." className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-[10px] font-bold uppercase outline-none" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 space-y-2">
            {chats.map((chat) => (
              <button key={chat.id} onClick={() => setActiveChat(chat)} className={`w-full flex items-center gap-4 p-4 rounded-[1.5rem] transition-all ${activeChat?.id === chat.id ? 'bg-gold-500 text-slate-950' : 'hover:bg-white/5 text-slate-400'}`}>
                <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-xs">{chat.full_name.charAt(0)}</div>
                <div className="text-left overflow-hidden">
                  <p className="font-black italic uppercase text-[10px] truncate">{chat.full_name}</p>
                  <p className="text-[8px] font-bold uppercase">{chat.user_role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col relative">
          {activeChat ? (
            <>
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-950/50 backdrop-blur-md">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center text-slate-950 font-black italic">{activeChat.full_name.charAt(0)}</div>
                  <div>
                    <h2 className="font-black italic uppercase tracking-tight">{activeChat.full_name}</h2>
                    <p className="text-[8px] text-gold-500 font-bold uppercase tracking-[0.2em]">Online Now</p>
                  </div>
                </div>
                <MoreVertical size={20} className="text-slate-500 cursor-pointer" />
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-5 rounded-[2rem] text-sm italic ${msg.sender_id === currentUser.id ? 'bg-gold-500 text-slate-950 rounded-tr-none' : 'bg-white/5 text-white border border-white/5 rounded-tl-none'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>
              <form onSubmit={sendMessage} className="p-8 bg-slate-950">
                <div className="relative flex items-center gap-4 bg-white/5 border border-white/5 rounded-[2rem] p-2 pr-4">
                  <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your elite proposal..." className="flex-1 bg-transparent border-none outline-none text-sm italic py-4 pl-4" />
                  <button type="submit" className="bg-gold-500 text-slate-950 p-4 rounded-2xl hover:bg-white transition-all"><Send size={18} /></button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
                <MessageSquare className="text-slate-800" size={32} />
              </div>
              <h3 className="text-xl font-black italic uppercase text-slate-500">Select a Conversation</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;