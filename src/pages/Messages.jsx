import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Send, User as UserIcon, Mail, ShieldAlert } from 'lucide-react';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (user) fetchChats(user.id);
    };
    setup();

    const channel = supabase.channel('chat_room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChats = async (userId) => {
    // እዚህ ጋር ከዳታቤዝ የቻት ሊስት ማምጣት ትችላለህ
    setChats([
      { id: '1', name: 'Elite Client', lastMsg: 'ስራው ላይ ጥያቄ አለኝ...' },
      { id: '2', name: 'Natti Designer', lastMsg: 'ሎጎውን ጨርሻለሁ' }
    ]);
  };

  const fetchMessages = async (chatId) => {
    if (!currentUser) return;
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // የደህንነት ጥበቃ (Regex for Links and Phones)
    const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9]+\.[a-z]{2,})/gi;
    const phonePattern = /(\+?[0-9]{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;

    if (urlPattern.test(newMessage) || phonePattern.test(newMessage)) {
      alert("ለደህንነት ሲባል ስልክ ቁጥር ወይም የውጪ ሊንክ መላክ የተከለከለ ነው!");
      return;
    }

    if (!newMessage.trim() || !selectedChat) return;

    const { error } = await supabase.from('messages').insert([
      {
        sender_id: currentUser.id,
        receiver_id: selectedChat.id,
        text: newMessage
      }
    ]);

    if (!error) setNewMessage('');
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-950 px-6 pb-10 flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-grow bg-slate-900/30 border border-slate-800 rounded-[3rem] overflow-hidden flex shadow-2xl">
        
        {/* የግራ ክፍል - Chat List */}
        <div className="w-1/3 border-r border-slate-800 flex flex-col bg-slate-950/40">
          <div className="p-8 border-b border-slate-800">
            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">Messages</h2>
          </div>
          <div className="flex-grow overflow-y-auto">
            {chats.map(chat => (
              <div 
                key={chat.id}
                onClick={() => { setSelectedChat(chat); fetchMessages(chat.id); }}
                className={`p-6 border-b border-slate-900 cursor-pointer transition-all hover:bg-gold-500/5 ${selectedChat?.id === chat.id ? 'bg-gold-500/10 border-r-4 border-r-gold-500' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase italic">{chat.name}</h4>
                    <p className="text-[10px] text-slate-500 truncate w-32">{chat.lastMsg}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* የቀኝ ክፍል - Chat Window */}
        <div className="flex-grow flex flex-col bg-slate-950/20 relative">
          {selectedChat ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex items-center gap-4 bg-slate-900/50 backdrop-blur-md">
                <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center font-black text-slate-950 text-xs italic">
                  {selectedChat.name.charAt(0)}
                </div>
                <h3 className="text-sm font-black text-white uppercase italic">{selectedChat.name}</h3>
              </div>

              {/* Messages Display */}
              <div className="flex-grow p-8 overflow-y-auto space-y-6">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-6 py-4 rounded-3xl text-sm font-medium ${
                      msg.sender_id === currentUser?.id 
                      ? 'bg-gold-500 text-slate-950 rounded-tr-none italic' 
                      : 'bg-slate-800 text-white rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>

              {/* Input Area with Warning */}
              <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-2 mb-3 text-amber-500/80">
                  <ShieldAlert className="w-3 h-3" />
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] italic">
                    Security: Phone numbers and links are strictly blocked.
                  </p>
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-4">
                  <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="TYPE YOUR MESSAGE..."
                    className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white text-[10px] font-black tracking-widest outline-none focus:border-gold-500/50 transition-all uppercase italic"
                  />
                  <button type="submit" className="bg-gold-500 text-slate-950 p-4 rounded-2xl hover:bg-white transition-all active:scale-95 shadow-lg shadow-gold-500/20">
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-slate-600">
              <div className="w-20 h-20 border border-slate-900 rounded-[2rem] flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">Select a conversation to start</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;