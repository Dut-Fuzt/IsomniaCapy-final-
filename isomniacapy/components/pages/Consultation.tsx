import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../../types';
import { getConsultationResponse } from '../../services/geminiService';
import Button from '../common/Button';
import Card from '../common/Card';

interface ConsultationProps {
  goHome: () => void;
}

const LoadingBubble: React.FC = () => (
    <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);


const Consultation: React.FC<ConsultationProps> = ({ goHome }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Chào bạn, mình là CapyBot! Bạn cần mình tư vấn về vấn đề học tập nào hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const systemInstruction = "You are CapyBot, a friendly and encouraging study assistant for students, speaking Vietnamese. Your goal is to help students with their learning, time management, and motivation. Answer questions related to studying, creating schedules, learning methods, and student well-being. If a question is clearly outside of these topics (e.g., politics, adult topics), politely state in Vietnamese that you can only help with study-related questions ('Mình chỉ có thể giúp các câu hỏi liên quan đến học tập thôi bạn nhé!'). Keep your tone positive and supportive.";

  const sendMessage = async () => {
    if (input.trim() === '' || loading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const history = newMessages.map((msg): { role: 'user' | 'model'; parts: { text: string }[] } => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
    
    // Remove the latest user message from history for the API call
    history.pop();
    
    const aiResponseText = await getConsultationResponse(history, input, systemInstruction);
    const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };

    setMessages(prev => [...prev, aiMessage]);
    setLoading(false);
  };
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestionChips = ["Gợi ý lộ trình học cho tôi", "Làm thế nào để học hiệu quả?", "Cho tôi lời khuyên cho buổi tự học."];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mb-4">
            <Button onClick={goHome} variant="ghost">← Quay về trang chủ</Button>
        </div>
        <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Tư vấn học tập</h1>
            <div className="flex-grow bg-gray-50 rounded-lg p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl whitespace-pre-wrap ${msg.sender === 'ai' ? 'bg-purple-100 text-gray-800 rounded-bl-none' : 'bg-green-500 text-white rounded-br-none'}`}>
                        {msg.text}
                    </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                    <div className="p-3 rounded-2xl bg-purple-100">
                        <LoadingBubble />
                    </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="pt-4 border-t">
                 <div className="flex flex-wrap gap-2 mb-2">
                    {suggestionChips.map(suggestion => (
                        <button key={suggestion} onClick={() => setInput(suggestion)} className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full hover:bg-gray-300 transition">
                            {suggestion}
                        </button>
                    ))}
                 </div>
                <div className="flex gap-2">
                    <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Hỏi CapyBot điều gì đó..."
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition"
                    />
                    <Button onClick={sendMessage} disabled={loading} variant="secondary">Gửi</Button>
                </div>
            </div>
        </Card>
    </div>
  );
};

export default Consultation;
