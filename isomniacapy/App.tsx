import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AppPage, SurveyData, TimetableTask, DailyNote } from './types';
import Intro from './components/pages/Intro';
import Features from './components/pages/Features';
import Survey from './components/pages/Survey';
import ConfirmationChat from './components/pages/ConfirmationChat';
import Homepage from './components/pages/Homepage';
import Consultation from './components/pages/Consultation';
import Timetable from './components/pages/Timetable';
import StudyMethods from './components/pages/StudyMethods';
import BehaviorReflection from './components/pages/BehaviorReflection';
import Settings from './components/Settings';
import Capybara from './components/Capybara';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>(AppPage.Intro);
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({ 
    capyFollowsMouse: true,
    showCapy: true,
  });
  
  // App-wide state
  const [streak, setStreak] = useState<number>(0);
  const [subjects, setSubjects] = useState<string[]>(['Toán', 'Vật lý', 'Hóa học', 'Sinh học', 'Ngữ văn', 'Lịch sử', 'Địa lý', 'Ngoại ngữ']);
  const [tasks, setTasks] = useState<Record<string, TimetableTask[]>>({});
  const [dailyNotes, setDailyNotes] = useState<Record<string, DailyNote[]>>({});
  const [lastStreakUpdate, setLastStreakUpdate] = useState<string>('');

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
        const savedStreak = localStorage.getItem('isomniaCapyStreak');
        const savedSubjects = localStorage.getItem('isomniaCapySubjects');
        const savedTasks = localStorage.getItem('isomniaCapyTasks');
        const savedDailyNotes = localStorage.getItem('isomniaCapyDailyNotes');
        const savedLastStreakUpdate = localStorage.getItem('isomniaCapyLastStreakUpdate');
        const savedSettings = localStorage.getItem('isomniaCapySettings');

        if (savedStreak) setStreak(JSON.parse(savedStreak));
        if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
        if (savedTasks) setTasks(JSON.parse(savedTasks));
        if (savedDailyNotes) setDailyNotes(JSON.parse(savedDailyNotes));
        if (savedLastStreakUpdate) setLastStreakUpdate(JSON.parse(savedLastStreakUpdate));
        if (savedSettings) setSettings(JSON.parse(savedSettings));

    } catch (error) {
        console.error("Failed to load state from localStorage", error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
        localStorage.setItem('isomniaCapyStreak', JSON.stringify(streak));
        localStorage.setItem('isomniaCapySubjects', JSON.stringify(subjects));
        localStorage.setItem('isomniaCapyTasks', JSON.stringify(tasks));
        localStorage.setItem('isomniaCapyDailyNotes', JSON.stringify(dailyNotes));
        localStorage.setItem('isomniaCapyLastStreakUpdate', JSON.stringify(lastStreakUpdate));
        localStorage.setItem('isomniaCapySettings', JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to save state to localStorage", error);
    }
  }, [streak, subjects, tasks, dailyNotes, lastStreakUpdate, settings]);

  const navigateTo = useCallback((page: AppPage) => {
    setCurrentPage(page);
  }, []);

  const handleSurveySubmit = (data: SurveyData) => {
    setSurveyData(data);
    navigateTo(AppPage.Confirmation);
  };
  
  const goHome = useCallback(() => navigateTo(AppPage.Homepage), [navigateTo]);

  const handleTaskToggle = (dateKey: string, taskId: string) => {
    setTasks(prevTasks => {
        const newTasks = { ...prevTasks };
        const dayTasks = newTasks[dateKey] ? [...newTasks[dateKey]] : [];
        const taskIndex = dayTasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            dayTasks[taskIndex] = { ...dayTasks[taskIndex], completed: !dayTasks[taskIndex].completed };
        }
        newTasks[dateKey] = dayTasks;

        // Check for streak increase
        const allComplete = dayTasks.every(t => t.completed);
        if (allComplete && dayTasks.length > 0 && lastStreakUpdate !== dateKey) {
            setStreak(s => s + 1);
            setLastStreakUpdate(dateKey);
        }

        return newTasks;
    });
  };
  
  const todayKey = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks[todayKey] || [];

  const renderPage = () => {
    switch (currentPage) {
      case AppPage.Intro:
        return <Intro onNext={() => navigateTo(AppPage.Features)} />;
      case AppPage.Features:
        return <Features onNext={() => navigateTo(AppPage.Survey)} onSkip={goHome} />;
      case AppPage.Survey:
        return <Survey onSubmit={handleSurveySubmit} onSkip={goHome} />;
      case AppPage.Confirmation:
        return <ConfirmationChat surveyData={surveyData} onConfirm={goHome} />;
      case AppPage.Homepage:
        return <Homepage navigateTo={navigateTo} streak={streak} todaysTasks={todaysTasks} onTaskToggle={(taskId) => handleTaskToggle(todayKey, taskId)} />;
      case AppPage.Consultation:
        return <Consultation goHome={goHome} />;
      case AppPage.Timetable:
        return <Timetable goHome={goHome} subjects={subjects} setSubjects={setSubjects} tasks={tasks} setTasks={setTasks} dailyNotes={dailyNotes} setDailyNotes={setDailyNotes} />;
       case AppPage.StudyMethods:
         return <StudyMethods goHome={goHome} />;
       case AppPage.BehaviorReflection:
         return <BehaviorReflection goHome={goHome} />;
      default:
        return <Homepage navigateTo={navigateTo} streak={streak} todaysTasks={todaysTasks} onTaskToggle={(taskId) => handleTaskToggle(todayKey, taskId)} />;
    }
  };
  
  const backgroundClass = useMemo(() => {
    switch (currentPage) {
        case AppPage.Intro:
        case AppPage.Features:
            return 'bg-gradient-to-br from-purple-100 via-blue-100 to-green-100';
        default:
            return 'bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100';
    }
  }, [currentPage]);

  return (
    <main className={`w-screen h-screen font-sans text-gray-800 transition-colors duration-500 ${backgroundClass}`}>
      {settings.showCapy && <Capybara position="bottom-right" followMouse={settings.capyFollowsMouse} />}
      
      <div className="absolute top-4 right-4 z-50">
        <button onClick={() => setIsSettingsOpen(true)} className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl shadow-md border border-gray-200 hover:bg-white/80 transition">
          ⚙️
        </button>
      </div>

      {isSettingsOpen && <Settings settings={settings} setSettings={setSettings} onClose={() => setIsSettingsOpen(false)} />}

      {renderPage()}
    </main>
  );
};

export default App;
