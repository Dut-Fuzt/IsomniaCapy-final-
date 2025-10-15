import React, { useState } from 'react';
import { TimetableTask, DailyNote } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';

interface TimetableProps {
    goHome: () => void;
    subjects: string[];
    setSubjects: React.Dispatch<React.SetStateAction<string[]>>;
    tasks: Record<string, TimetableTask[]>;
    setTasks: React.Dispatch<React.SetStateAction<Record<string, TimetableTask[]>>>;
    dailyNotes: Record<string, DailyNote[]>;
    setDailyNotes: React.Dispatch<React.SetStateAction<Record<string, DailyNote[]>>>;
}

const holidays: Record<string, string> = {
  // 2024
  '2024-01-01': "Tết Dương lịch",
  '2024-02-09': "Giao thừa",
  '2024-02-10': "Mùng 1 Tết",
  '2024-02-11': "Mùng 2 Tết",
  '2024-02-12': "Mùng 3 Tết",
  '2024-04-18': "Giỗ Tổ Hùng Vương",
  '2024-04-30': "Ngày Giải phóng miền Nam",
  '2024-05-01': "Ngày Quốc tế Lao động",
  '2024-09-02': "Ngày Quốc khánh",
  // 2025 (tentative)
  '2025-01-01': "Tết Dương lịch",
  '2025-01-28': "Giao thừa",
  '2025-01-29': "Mùng 1 Tết",
  '2025-01-30': "Mùng 2 Tết",
  '2025-04-06': "Giỗ Tổ Hùng Vương",
  '2025-04-30': "Ngày Giải phóng miền Nam",
  '2025-05-01': "Ngày Quốc tế Lao động",
  '2025-09-02': "Ngày Quốc khánh",
};


const DayCard: React.FC<{ 
    day: number; 
    dateKey: string; 
    tasks: TimetableTask[]; 
    notes: DailyNote[];
    holiday: string | null;
    onDrop: (dateKey: string) => void; 
    onTaskClick: (task: TimetableTask, dateKey: string) => void; 
    onNoteClick: (note: DailyNote, dateKey: string) => void;
    onAddNote: (dateKey: string) => void;
    onDeleteTask: (taskId: string, dateKey: string) => void;
    onDeleteNote: (noteId: string, dateKey: string) => void;
    isToday: boolean 
}> = ({ day, dateKey, tasks, notes, holiday, onDrop, onTaskClick, onNoteClick, onAddNote, onDeleteTask, onDeleteNote, isToday }) => {
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        onDrop(dateKey);
    };

    return (
        <div 
            onDragOver={handleDragOver} 
            onDrop={handleDrop}
            className={`relative group h-32 border border-gray-200 rounded-lg p-1.5 flex flex-col bg-white/50 transition ${isToday ? 'border-2 border-blue-500' : ''}`}
        >
            <span className={`font-semibold text-sm ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>{day}</span>
            <button onClick={() => onAddNote(dateKey)} title="Thêm ghi chú" className="absolute top-0.5 right-0.5 w-5 h-5 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-gray-300 transition-opacity text-sm">+</button>

            <div className="flex-grow overflow-y-auto text-xs space-y-1 mt-1 pr-1">
                {holiday && <p className="text-red-600 font-semibold truncate" title={holiday}>{holiday}</p>}

                {tasks.map(task => (
                    <div key={task.id} className="relative group/item bg-blue-100 text-blue-800 p-1 rounded">
                        <p onClick={() => onTaskClick(task, dateKey)} className="cursor-pointer">
                           <strong>{task.subject}</strong>: {task.note}
                        </p>
                        <button onClick={() => onDeleteTask(task.id, dateKey)} className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center text-blue-700 opacity-0 group-hover/item:opacity-100 hover:text-red-500" title="Xóa môn học">×</button>
                    </div>
                ))}
                 {notes.map(note => (
                    <div key={note.id} className="relative group/item bg-green-100 text-green-800 p-1 rounded">
                        <p onClick={() => onNoteClick(note, dateKey)} className="cursor-pointer">
                            {note.text}
                        </p>
                        <button onClick={() => onDeleteNote(note.id, dateKey)} className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center text-green-700 opacity-0 group-hover/item:opacity-100 hover:text-red-500" title="Xóa ghi chú">×</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Timetable: React.FC<TimetableProps> = ({ goHome, subjects, setSubjects, tasks, setTasks, dailyNotes, setDailyNotes }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [newSubject, setNewSubject] = useState('');

    const handleAddSubject = () => {
        if (newSubject && !subjects.includes(newSubject)) {
            setSubjects(prev => [...prev, newSubject]);
            setNewSubject('');
        }
    };

    const handleDrop = (dateKey: string, subject: string) => {
        const note = prompt(`Thêm ghi chú cho môn ${subject} vào ngày ${dateKey}:`, 'Làm bài tập.');
        if (note !== null) {
            const newTask: TimetableTask = { id: `${dateKey}-${subject}-${Date.now()}`, subject, note, completed: false };
            setTasks(prev => ({ ...prev, [dateKey]: [...(prev[dateKey] || []), newTask] }));
        }
    };

    const handleTaskClick = (task: TimetableTask, dateKey: string) => {
        const newNote = prompt(`Chỉnh sửa ghi chú cho môn ${task.subject}:`, task.note);
        if (newNote !== null && newNote !== task.note) {
            setTasks(prev => ({ ...prev, [dateKey]: prev[dateKey].map(t => t.id === task.id ? { ...t, note: newNote } : t) }));
        }
    };

     const handleAddNote = (dateKey: string) => {
        const text = prompt('Thêm ghi chú cho ngày này:');
        if (text) {
            const newNote: DailyNote = { id: `note-${Date.now()}`, text };
            setDailyNotes(prev => ({ ...prev, [dateKey]: [...(prev[dateKey] || []), newNote] }));
        }
    };
    
    const handleNoteClick = (note: DailyNote, dateKey: string) => {
        const newText = prompt('Chỉnh sửa ghi chú:', note.text);
        if (newText !== null && newText !== note.text) {
            setDailyNotes(prev => ({ ...prev, [dateKey]: prev[dateKey].map(n => n.id === note.id ? { ...n, text: newText } : n) }));
        }
    };

    const handleDeleteTask = (taskId: string, dateKey: string) => {
        if (window.confirm('Bạn có chắc muốn xóa công việc này?')) {
            setTasks(prev => ({ ...prev, [dateKey]: prev[dateKey].filter(t => t.id !== taskId) }));
        }
    };
    
    const handleDeleteNote = (noteId: string, dateKey: string) => {
        if (window.confirm('Bạn có chắc muốn xóa ghi chú này?')) {
            setDailyNotes(prev => ({ ...prev, [dateKey]: prev[dateKey].filter(n => n.id !== noteId) }));
        }
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayKey = new Date().toISOString().split('T')[0];

    return (
        <div className="w-full h-full flex flex-col p-4">
            <div className="flex justify-between items-center mb-4">
                <Button onClick={goHome} variant="ghost">← Quay về trang chủ</Button>
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {currentDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' })}
                    </h1>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>Tháng trước</Button>
                    <Button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>Tháng sau</Button>
                </div>
            </div>
            
            <div className="flex flex-grow gap-4">
                <div className="w-3/4">
                    <Card className="w-full h-full">
                        <div className="grid grid-cols-7 gap-2 text-center font-bold text-gray-500 mb-2">
                            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => <div key={d}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`}></div>)}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                return (
                                    <DayCard 
                                        key={day} day={day} dateKey={dateKey} 
                                        tasks={tasks[dateKey] || []}
                                        notes={dailyNotes[dateKey] || []}
                                        holiday={holidays[dateKey] || null}
                                        onDrop={(dk) => handleDrop(dk, (window as any).draggedSubject)}
                                        onTaskClick={handleTaskClick}
                                        onNoteClick={handleNoteClick}
                                        onAddNote={handleAddNote}
                                        onDeleteTask={handleDeleteTask}
                                        onDeleteNote={handleDeleteNote}
                                        isToday={dateKey === todayKey}
                                    />
                                );
                            })}
                        </div>
                    </Card>
                </div>
                <div className="w-1/4">
                    <Card className="w-full h-full flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Môn học</h2>
                        <p className="text-sm text-gray-500 mb-2">Kéo và thả môn học vào lịch.</p>
                        <div className="flex-grow space-y-2 overflow-y-auto pr-2">
                            {subjects.map(subject => (
                                <div 
                                    key={subject} 
                                    draggable 
                                    onDragStart={() => ((window as any).draggedSubject = subject)}
                                    className="p-3 bg-green-100 text-green-800 rounded-lg cursor-grab active:cursor-grabbing"
                                >
                                    {subject}
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <input 
                                type="text"
                                value={newSubject}
                                onChange={e => setNewSubject(e.target.value)}
                                placeholder="Thêm môn học mới..."
                                className="w-full p-2 border rounded-lg mb-2"
                            />
                            <Button onClick={handleAddSubject} className="w-full">Thêm</Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Timetable;
