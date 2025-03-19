
import React, { useState, useEffect } from 'react';
import { Sun, Moon, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import AnimatedLogo from '@/components/shared/AnimatedLogo';
import { toast } from 'sonner';
import { useNotes } from '@/contexts/NotesContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  const { createNote, setActiveNote } = useNotes();
  
  // Apply theme class to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    toast.success(`${theme === 'light' ? 'Dark' : 'Light'} mode activated`);
  };
  
  const createNewNote = () => {
    const newNote = createNote();
    setActiveNote(newNote);
    navigate('/notes');
  };
  
  return (
    <div className="h-dynamic-screen flex flex-col">
      <header className="premium-card z-10 py-4 px-6 flex items-center justify-between transition-all duration-300">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <AnimatedLogo size="sm" animate={false} />
          <h1 className="font-semibold text-xl tracking-tight">VoiceScribe</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {location.pathname !== '/' && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={createNewNote}
              className="rounded-full"
              title="Create new note"
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
