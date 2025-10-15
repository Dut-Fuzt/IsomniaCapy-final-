import React, { useState, useEffect } from 'react';
import { AppPage, TimetableTask } from '../../types';
import Card from '../common/Card';

interface HomepageProps {
  navigateTo: (page: AppPage) => void;
  streak: number;
  todaysTasks: TimetableTask[];
  onTaskToggle: (id: string) => void;
}

const featureButtons = [
  { page: AppPage.Timetable, label: 'Thời khóa biểu', icon: '📅', color: 'bg-blue-100 text-blue-800' },
  { page: AppPage.StudyMethods, label: 'Phương pháp học', icon: '🧠', color: 'bg-green-100 text-green-800' },
  { page: AppPage.BehaviorReflection, label: 'Nhìn nhận hành vi', icon: '📱', color: 'bg-yellow-100 text-yellow-800' },
  { page: AppPage.Consultation, label: 'Tư vấn', icon: '💬', color: 'bg-purple-100 text-purple-800' },
];

const Homepage: React.FC<HomepageProps> = ({ navigateTo, streak, todaysTasks, onTaskToggle }) => {
  const [quickNote, setQuickNote] = useState('');

  useEffect(() => {
    const savedNote = localStorage.getItem('isomniaCapyQuickNote');
    if (savedNote) {
      setQuickNote(savedNote);
    }
  }, []);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuickNote(e.target.value);
    localStorage.setItem('isomniaCapyQuickNote', e.target.value);
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 overflow-y-auto">
       <div className="absolute top-4 right-20 z-10">
          <div className="bg-orange-100 border-2 border-orange-300 rounded-full px-4 py-2 shadow-lg text-orange-800 font-bold text-lg">
              🔥 {streak}
          </div>
       </div>

      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 mt-16 text-center">
        Welcome to IsomniaCapy
      </h1>
      <p className="text-lg text-gray-500 mb-8 text-center">Hãy chọn một công cụ để bắt đầu nhé!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full">
        {featureButtons.map((feature) => (
          <button
            key={feature.label}
            onClick={() => navigateTo(feature.page)}
            className="group bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 transition-all duration-300 group-hover:scale-110 ${feature.color}`}>
              {feature.icon}
            </div>
            <h2 className="text-xl font-semibold text-gray-700">{feature.label}</h2>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full mt-8">
        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Hôm nay có gì?</h2>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {todaysTasks.length > 0 ? todaysTasks.map(task => (
              <label key={task.id} className={`flex items-center p-3 rounded-lg cursor-pointer transition ${task.completed ? 'bg-green-100 text-gray-500 line-through' : 'bg-white hover:bg-gray-50'}`}>
                <input type="checkbox" checked={task.completed} onChange={() => onTaskToggle(task.id)} className="form-checkbox h-5 w-5 text-blue-600 rounded mr-4" />
                <span className="font-semibold">{task.subject}:</span>
                <span className="ml-2 text-gray-700">{task.note}</span>
              </label>
            )) : (
              <p className="text-gray-500">Hôm nay bạn không có lịch học. Tận hưởng ngày nghỉ nhé!</p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ghi chú nhanh</h2>
           <textarea 
             value={quickNote}
             onChange={handleNoteChange}
             className="w-full h-[152px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition bg-yellow-50/50" 
             placeholder="Viết nhanh một vài ý tưởng..."/>
        </Card>
      </div>

    </div>
  );
};

export default Homepage;
