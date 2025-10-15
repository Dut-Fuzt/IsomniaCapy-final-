import React, { useState, useEffect } from 'react';
import { BehaviorLogRow, ChatMessage } from '../../types';
import { analyzeBehavior } from '../../services/geminiService';
import Button from '../common/Button';
import Card from '../common/Card';

interface BehaviorReflectionProps {
  goHome: () => void;
}

const LoadingBubble: React.FC = () => (
    <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);

const BehaviorReflection: React.FC<BehaviorReflectionProps> = ({ goHome }) => {
    const [rows, setRows] = useState<BehaviorLogRow[]>([
        { id: 1, device: 'Điện thoại', startTime: '08:00', endTime: '09:30', duration: '', benefits: 'Xem tin tức', feeling: 'Bình thường' }
    ]);
    const [aiChat, setAiChat] = useState<ChatMessage[]>([]);
    const [userResponse, setUserResponse] = useState('');
    const [stage, setStage] = useState<'logging' | 'analyzing' | 'reflecting' | 'finished'>('logging');
    const [loading, setLoading] = useState(false);

    const calculateDuration = (start: string, end: string): string => {
        if (!start || !end) return '';
        try {
            const [startH, startM] = start.split(':').map(Number);
            const [endH, endM] = end.split(':').map(Number);
            const startDate = new Date(0, 0, 0, startH, startM);
            const endDate = new Date(0, 0, 0, endH, endM);
            let diff = endDate.getTime() - startDate.getTime();
            if (diff < 0) { // Handles overnight case
                const dayInMillis = 24 * 60 * 60 * 1000;
                diff += dayInMillis;
            }
            const minutes = Math.floor(diff / 60000);
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;
            return `${h > 0 ? `${h} giờ ` : ''}${m} phút`;
        } catch {
            return 'Invalid';
        }
    };
    
    useEffect(() => {
        setRows(rows => rows.map(row => ({ ...row, duration: calculateDuration(row.startTime, row.endTime) })));
    }, []);

    const handleRowChange = (id: number, field: keyof Omit<BehaviorLogRow, 'id' | 'duration'>, value: string) => {
        const newRows = rows.map(row => {
            if (row.id === id) {
                const updatedRow = { ...row, [field]: value };
                return { ...updatedRow, duration: calculateDuration(updatedRow.startTime, updatedRow.endTime) };
            }
            return row;
        });
        setRows(newRows);
    };

    const addRow = () => {
        setRows([...rows, { id: Date.now(), device: '', startTime: '', endTime: '', duration: '', benefits: '', feeling: '' }]);
    };

    const handleFinishLogging = async () => {
        setStage('analyzing');
        setLoading(true);
        const tableData = rows.map(r => `"${r.device}","${r.startTime}","${r.endTime}","${r.duration}","${r.benefits}","${r.feeling}"`).join('\n');
        const analysis = await analyzeBehavior(tableData, null);
        setAiChat([{ sender: 'ai', text: analysis }]);
        setStage('reflecting');
        setLoading(false);
    };

    const handleSendReflection = async () => {
        if (!userResponse.trim()) return;
        setAiChat(prev => [...prev, { sender: 'user', text: userResponse }]);
        setLoading(true);

        const tableData = rows.map(r => `"${r.device}","${r.startTime}","${r.endTime}","${r.duration}","${r.benefits}","${r.feeling}"`).join('\n');
        const finalAdvice = await analyzeBehavior(tableData, userResponse);

        setAiChat(prev => [...prev, { sender: 'ai', text: finalAdvice }]);
        setUserResponse('');
        setStage('finished');
        setLoading(false);
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-4 overflow-y-auto">
            <div className="w-full max-w-5xl mb-4">
                <Button onClick={goHome} variant="ghost">← Quay về trang chủ</Button>
            </div>
            
            <Card className="w-full max-w-5xl">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Nhìn nhận hành vi sử dụng thiết bị điện tử</h1>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                {["Thiết bị", "Bắt đầu", "Kết thúc", "Thời lượng", "Lợi ích", "Trạng thái sau sử dụng"].map(h => <th key={h} className="p-3 font-semibold text-gray-600">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(row => (
                                <tr key={row.id} className="border-b">
                                    <td className="p-2"><input type="text" value={row.device} onChange={e => handleRowChange(row.id, 'device', e.target.value)} className="w-full p-2 border rounded" disabled={stage !== 'logging'} /></td>
                                    <td className="p-2"><input type="time" value={row.startTime} onChange={e => handleRowChange(row.id, 'startTime', e.target.value)} className="w-full p-2 border rounded" disabled={stage !== 'logging'} /></td>
                                    <td className="p-2"><input type="time" value={row.endTime} onChange={e => handleRowChange(row.id, 'endTime', e.target.value)} className="w-full p-2 border rounded" disabled={stage !== 'logging'} /></td>
                                    <td className="p-2"><input type="text" value={row.duration} readOnly className="w-full p-2 border rounded bg-gray-50" /></td>
                                    <td className="p-2"><input type="text" value={row.benefits} onChange={e => handleRowChange(row.id, 'benefits', e.target.value)} className="w-full p-2 border rounded" disabled={stage !== 'logging'} /></td>
                                    <td className="p-2"><input type="text" value={row.feeling} onChange={e => handleRowChange(row.id, 'feeling', e.target.value)} className="w-full p-2 border rounded" disabled={stage !== 'logging'} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {stage === 'logging' && (
                    <div className="flex justify-between items-center mt-4">
                        <Button onClick={addRow} variant="ghost"> + Thêm hàng</Button>
                        <Button onClick={handleFinishLogging}>Hoàn thành</Button>
                    </div>
                )}
            </Card>

            {(stage !== 'logging') && (
                 <Card className="w-full max-w-5xl mt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Phân tích & Phản hồi</h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                       {aiChat.map((msg, index) => (
                         <div key={index} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-prose p-3 rounded-2xl whitespace-pre-wrap ${msg.sender === 'ai' ? 'bg-yellow-100 text-gray-800 rounded-bl-none' : 'bg-green-500 text-white rounded-br-none'}`}>
                               {msg.text}
                            </div>
                         </div>
                       ))}
                       {loading && <div className="flex justify-start"><div className="p-3 rounded-2xl bg-yellow-100"><LoadingBubble /></div></div>}
                    </div>

                    {stage === 'reflecting' && (
                        <div className="mt-4 pt-4 border-t flex gap-2">
                            <input type="text" value={userResponse} onChange={e => setUserResponse(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendReflection()} placeholder="Theo bạn, bạn có cách nào để khắc phục?" className="flex-grow p-3 border rounded-lg"/>
                            <Button onClick={handleSendReflection}>Gửi phản hồi</Button>
                        </div>
                    )}
                 </Card>
            )}
        </div>
    );
};

export default BehaviorReflection;
