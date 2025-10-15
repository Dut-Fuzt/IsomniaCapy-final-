
import React, { useState, useEffect, useRef } from 'react';
import { SurveyData, ChatMessage } from '../../types';
import { summarizeSurvey } from '../../services/geminiService';
import Button from '../common/Button';
import Card from '../common/Card';

interface ConfirmationChatProps {
  surveyData: SurveyData | null;
  onConfirm: () => void;
}

const LoadingBubble: React.FC = () => (
    <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);

const ConfirmationChat: React.FC<ConfirmationChatProps> = ({ surveyData, onConfirm }) => {
  const [isChatting, setIsChatting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const startChat = async () => {
    setIsChatting(true);
    setLoading(true);
    if (surveyData) {
      const summary = await summarizeSurvey(surveyData);
      setMessages([{ sender: 'ai', text: summary }]);
    } else {
       setMessages([{ sender: 'ai', text: "Chào bạn! Sẵn sàng để bắt đầu hành trình học tập hiệu quả chưa?" }]);
    }
    setLoading(false);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isChatting) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <Card className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Cảm ơn bạn đã chia sẻ!</h1>
          <p className="text-gray-600 mb-6">Hãy cùng xem AI tóm tắt thông tin của bạn nhé.</p>
          <Button onClick={startChat}>Bắt đầu trò chuyện</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full h-[80vh] flex flex-col">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-800">Xác nhận thông tin</h2>
        <div className="flex-grow bg-gray-50 rounded-lg p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${msg.sender === 'ai' ? 'bg-indigo-100 text-gray-800 rounded-bl-none' : 'bg-blue-500 text-white rounded-br-none'}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="p-3 rounded-2xl bg-indigo-100">
                <LoadingBubble />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="mt-4 pt-4 border-t flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-4">Bạn có thể chỉnh sửa thông tin sau trong phần Cài đặt.</p>
            <Button onClick={onConfirm} className="w-full md:w-auto">
              Tuyệt vời, đến trang chủ thôi!
            </Button>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmationChat;
