
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BabyVisualizer from './components/BabyVisualizer';
import StoryCorner from './components/StoryCorner';
import MiniGames from './components/MiniGames';
import ActivityLogView from './components/ActivityLogView';
import { AppScreen, UserProfile, ActivityLog } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.DASHBOARD);
  
  // Simulated initial user data
  const [user, setUser] = useState<UserProfile>({
    name: 'Sarah',
    dueDate: '2024-06-15',
    currentWeek: 24,
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

  const handleSaveLog = (logData: Omit<ActivityLog, 'id' | 'date'>) => {
    const newLog: ActivityLog = {
      ...logData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setLogs([newLog, ...logs]);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.DASHBOARD:
        return <Dashboard user={user} recentLogs={logs} />;
      case AppScreen.VISUALIZER:
        return <BabyVisualizer week={user.currentWeek} />;
      case AppScreen.STORY:
        return <StoryCorner week={user.currentWeek} />;
      case AppScreen.GAMES:
        return <MiniGames />;
      case AppScreen.LOG:
        return <ActivityLogView onSave={handleSaveLog} />;
      default:
        return <Dashboard user={user} recentLogs={logs} />;
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
