import { useState, createContext, useContext } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { RegisterInstructor } from './components/RegisterInstructor';
import { RegisterTechnician } from './components/RegisterTechnician';
import { RegisterDoctor } from './components/RegisterDoctor';
import { MainApp } from './components/MainApp';
import { AboutLanding } from './components/AboutLanding';
import { removeAuthToken } from './services/api';

export type UserRole = 'student' | 'doctor' | 'instructor' | 'technician';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const useDarkMode = () => useContext(DarkModeContext);

export default function App() {
  const [currentView, setCurrentView] = useState<'about' | 'login' | 'register' | 'registerInstructor' | 'registerTechnician' | 'registerDoctor' | 'app'>('about');
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentView('app');
  };

  const handleRegister = (userData: User) => {
    setUser(userData);
    setCurrentView('app');
  };

  const handleShowRegister = (type?: string) => {
    if (type === 'instructor') {
      setCurrentView('registerInstructor');
    } else if (type === 'technician') {
      setCurrentView('registerTechnician');
    } else if (type === 'doctor') {
      setCurrentView('registerDoctor');
    } else {
      setCurrentView('register');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className={darkMode ? 'dark' : ''}>
        {currentView === 'about' && <AboutLanding onGetStarted={() => setCurrentView('login')} />}
        {currentView === 'login' && <Login onLogin={handleLogin} onShowRegister={handleShowRegister} />}
        {currentView === 'register' && <Register onRegister={handleRegister} onBackToLogin={() => setCurrentView('login')} />}
        {currentView === 'registerInstructor' && <RegisterInstructor onRegister={handleRegister} onBackToLogin={() => setCurrentView('login')} />}
        {currentView === 'registerTechnician' && <RegisterTechnician onRegister={handleRegister} onBackToLogin={() => setCurrentView('login')} />}
        {currentView === 'registerDoctor' && <RegisterDoctor onRegister={handleRegister} onBackToLogin={() => setCurrentView('login')} />}
        {currentView === 'app' && user && (
          <MainApp
            user={user}
            onLogout={() => {
              removeAuthToken();
              setUser(null);
              setCurrentView('about');
            }}
          />
        )}
      </div>
    </DarkModeContext.Provider>
  );
}
