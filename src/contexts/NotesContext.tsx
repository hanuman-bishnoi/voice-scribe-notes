
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  language?: string; // Added language field
}

interface NotesContextType {
  notes: Note[];
  activeNote: Note | null;
  setActiveNote: (note: Note | null) => void;
  createNote: (title?: string, content?: string, language?: string) => Note;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  searchNotes: (query: string) => Note[];
  filteredNotes: Note[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  exportNoteToPdf: (note: Note) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load notes from localStorage on initial render
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('voiceNotes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(notes);
  
  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('voiceNotes', JSON.stringify(notes));
    
    // Update filtered notes when notes or search query changes
    if (searchQuery) {
      setFilteredNotes(searchNotes(searchQuery));
    } else {
      setFilteredNotes(notes);
    }
  }, [notes, searchQuery]);
  
  const createNote = (title = 'Untitled Note', content = '', language = 'en-US') => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      language,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setNotes(prevNotes => [newNote, ...prevNotes]);
    toast.success('Note created');
    return newNote;
  };
  
  const updateNote = (id: string, data: Partial<Note>) => {
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === id 
          ? { ...note, ...data, updatedAt: new Date() } 
          : note
      )
    );
    
    // Also update activeNote if it's the one being edited
    if (activeNote && activeNote.id === id) {
      setActiveNote(prev => prev ? { ...prev, ...data, updatedAt: new Date() } : null);
    }
    
    // Show toast only if there's a substantial update (not for auto-saves)
    if (data.title || (data.content && data.content.length > 0 && !activeNote?.content)) {
      toast.success('Note updated');
    }
  };
  
  const deleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    
    // Clear activeNote if it's the one being deleted
    if (activeNote && activeNote.id === id) {
      setActiveNote(null);
    }
    
    toast.success('Note deleted');
  };
  
  const searchNotes = (query: string) => {
    if (!query.trim()) {
      return notes;
    }
    
    const lowerCaseQuery = query.toLowerCase();
    return notes.filter(
      note => 
        note.title.toLowerCase().includes(lowerCaseQuery) || 
        note.content.toLowerCase().includes(lowerCaseQuery)
    );
  };
  
  const exportNoteToPdf = (note: Note) => {
    // In a real app, this would use a library like jsPDF
    // For this demo, we'll use a simple text download
    const element = document.createElement('a');
    const file = new Blob(
      [`# ${note.title}\n\n${note.content}`], 
      { type: 'text/plain' }
    );
    
    element.href = URL.createObjectURL(file);
    element.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success('Note exported');
  };
  
  const value = {
    notes,
    activeNote,
    setActiveNote,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    filteredNotes,
    searchQuery,
    setSearchQuery,
    exportNoteToPdf,
  };
  
  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
