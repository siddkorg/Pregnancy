
import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StoryCorner from './components/StoryCorner';
import MiniGames from './components/MiniGames';
import ActivityLogView from './components/ActivityLogView';
import MoodCalendar from './components/MoodCalendar';
import ProfileSettings from './components/ProfileSettings';
import { AppScreen, UserProfile, ActivityLog } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.DASHBOARD);
  
  const [user, setUser] = useState<UserProfile>(() => {
    // Static default due date: July 5th, 2026
    return {
      name: 'Sarah',
      dueDate: '2026-07-05',
      currentWeek: 0, // Will be calculated by useMemo
    };
  });

  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      date: new Date().toISOString(),
      waterIntake: 8,
      sleepHours: 7.5,
      mood: 'calm',
      notes: 'Feeling a lot of kicks today!'
    }
  ]);

  // Calculate current week based on due date (40 weeks total)
  const currentWeek = useMemo(() => {
    const today = new Date();
    const due = new Date(user.dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Total pregnancy is 280 days (40 weeks)
    // Weeks remaining = diffDays / 7
    const weeksRemaining = diffDays / 7;
    const week = 40 - Math.floor(weeksRemaining);
    
    // Ensure we stay within a reasonable range (1 to 42 weeks)
    return Math.max(1, Math.min(42, week));
  }, [user.dueDate]);

  const handleSaveLog = (logData: Omit<ActivityLog, 'id' | 'date'>) => {
    const newLog: ActivityLog = {
      ...logData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setLogs([newLog, ...logs]);
  };

  const handleUpdateProfile = (name: string, dueDate: string) => {
    setUser(prev => ({ ...prev, name, dueDate }));
    setCurrentScreen(AppScreen.DASHBOARD);
  };

  const renderScreen = () => {
    const userWithCalculatedWeek = { ...user, currentWeek };
    switch (currentScreen) {
      case AppScreen.DASHBOARD:
        return <Dashboard user={userWithCalculatedWeek} recentLogs={logs} onOpenCalendar={() => setCurrentScreen(AppScreen.CALENDAR)} />;
      case AppScreen.STORY:
        return <StoryCorner week={currentWeek} />;
      case AppScreen.GAMES:
        return <MiniGames />;
      case AppScreen.LOG:
        return <ActivityLogView onSave={handleSaveLog} />;
      case AppScreen.CALENDAR:
        return <MoodCalendar logs={logs} onBack={() => setCurrentScreen(AppScreen.DASHBOARD)} />;
      case AppScreen.SETTINGS:
        return <ProfileSettings user={user} onSave={handleUpdateProfile} />;
      default:
        return <Dashboard user={userWithCalculatedWeek} recentLogs={logs} onOpenCalendar={() => setCurrentScreen(AppScreen.CALENDAR)} />;
    }
  };

  return (
    <Layout activeScreen={currentScreen} setScreen={setCurrentScreen}>
      <div className="animate-in fade-in duration-500">
        {renderScreen()}
      </div>
    </Layout>
  );
};

export default App;
