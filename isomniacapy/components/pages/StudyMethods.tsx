import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../../types';
import { getConsultationResponse } from '../../services/geminiService';
import Button from '../common/Button';
import Card from '../common/Card';

interface StudyMethodsProps {
  goHome: () => void;
}

const LoadingBubble: React.FC = () => (
    <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);

const studyMethods = [
    {
        name: "Kỹ thuật Pomodoro",
        description: "Phương pháp quản lý thời gian bằng cách chia công việc thành các khoảng thời gian tập trung 25 phút, xen kẽ với các khoảng nghỉ ngắn.",
        steps: [
            "Chọn một công việc cần hoàn thành.",
            "Đặt đồng hồ đếm ngược 25 phút.",
            "Làm việc tập trung cho đến khi hết giờ.",
            "Nghỉ ngắn 5 phút.",
            "Sau 4 lần Pomodoro, nghỉ dài hơn (15-30 phút)."
        ],
        benefits: "Tăng cường sự tập trung, giảm mệt mỏi, quản lý thời gian hiệu quả."
    },
    {
        name: "Kỹ thuật Feynman",
        description: "Học một chủ đề bằng cách giải thích nó bằng những thuật ngữ đơn giản như thể bạn đang dạy cho người khác.",
        steps: [
            "Chọn một khái niệm bạn muốn học.",
            "Viết ra lời giải thích về nó bằng ngôn ngữ đơn giản.",
            "Xem lại lời giải thích và xác định những chỗ bạn còn yếu.",
            "Quay lại tài liệu học và lấp đầy những lỗ hổng kiến thức.",
            "Tinh chỉnh và đơn giản hóa lời giải thích của bạn."
        ],
        benefits: "Hiểu sâu vấn đề, xác định lỗ hổng kiến thức, cải thiện khả năng ghi nhớ."
    },
];

const ChatWithAI: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'ai', text: 'Chào bạn! Bạn muốn tìm hiểu thêm về phương pháp học nào? Hãy hỏi mình nhé.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    
    const systemInstruction = `You are a friendly, expert study coach from Vietnam, speaking Vietnamese. Your goal is to provide hyper-specific, actionable advice.
**CRITICAL RULE: DO NOT give vague advice.** Answers like 'practice more' or 'review vocabulary' are forbidden.
When a student asks for help (e.g., 'how to get better at English'), you MUST provide a detailed, practical plan. This plan MUST include:
1.  **Specific Tools & Resources:** Name specific apps (e.g., Anki, Duolingo), websites (e.g., Khan Academy, BBC Learning English), or YouTube channels.
2.  **Actionable Techniques:** Instead of 'practice listening,' describe a specific exercise: 'Find a 5-minute English video with subtitles. Step 1: Watch without subtitles. Step 2: Watch with subtitles, noting new words. Step 3: Use the shadowing technique by speaking along with the video.'
3.  **Concrete Schedules:** Propose a sample daily/weekly routine. Example: 'Morning (15 mins): Review 20 Anki vocabulary flashcards. Afternoon (30 mins): Complete one grammar lesson on the British Council website. Evening (20 mins): Watch one episode of a simple English series like 'Peppa Pig' or 'Friends' with English subtitles.'

Always tailor advice to the subject. For non-study questions, politely decline with: 'Mình là chuyên gia về phương pháp học tập, nên chỉ có thể giúp bạn các vấn đề liên quan đến việc học thôi nhé!'.`;

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
        history.pop();
        
        const aiResponseText = await getConsultationResponse(history, input, systemInstruction);
        const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };

        setMessages(prev => [...prev, aiMessage]);
        setLoading(false);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Card className="w-full max-w-4xl h-[80vh] flex flex-col mt-4">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Tìm hiểu thêm với AI</h1>
            <div className="flex-grow bg-gray-50 rounded-lg p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl whitespace-pre-wrap ${msg.sender === 'ai' ? 'bg-indigo-100 text-gray-800 rounded-bl-none' : 'bg-green-500 text-white rounded-br-none'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && <div className="flex justify-start"><div className="p-3 rounded-2xl bg-indigo-100"><LoadingBubble /></div></div>}
                <div ref={chatEndRef} />
            </div>
            <div className="pt-4 border-t flex gap-2">
                <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} placeholder="Hỏi về một phương pháp học..." className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition" />
                <Button onClick={sendMessage} disabled={loading} variant="secondary">Gửi</Button>
            </div>
        </Card>
    );
};


const StudyMethods: React.FC<StudyMethodsProps> = ({ goHome }) => {
    const [showChat, setShowChat] = useState(false);

    return (
        <div className="w-full h-full flex flex-col items-center p-4 overflow-y-auto">
            <div className="w-full max-w-4xl mb-4">
                <Button onClick={goHome} variant="ghost">← Quay về trang chủ</Button>
            </div>
            
            <Card className="w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Phương pháp học hiệu quả</h1>
                <div className="space-y-4">
                    {studyMethods.map(method => (
                        <details key={method.name} className="bg-white/80 p-4 rounded-lg shadow-sm border group">
                            <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center">
                                {method.name}
                                <span className="text-gray-400 transform transition-transform group-open:rotate-180">▼</span>
                            </summary>
                            <div className="mt-4 text-gray-700 space-y-3">
                                <p>{method.description}</p>
                                <h4 className="font-semibold">Các bước áp dụng:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                    {method.steps.map((step, i) => <li key={i}>{step}</li>)}
                                </ul>
                                <p><strong className="font-semibold">Lợi ích:</strong> {method.benefits}</p>
                            </div>
                        </details>
                    ))}
                </div>
            </Card>

            <div className="w-full max-w-4xl mt-6 text-center">
                <Button variant="primary" onClick={() => setShowChat(s => !s)}>
                    {showChat ? 'Ẩn cửa sổ Chat AI' : 'Tìm hiểu thêm với AI'}
                </Button>
            </div>

            {showChat && <ChatWithAI />}
        </div>
    );
};

export default StudyMethods;
