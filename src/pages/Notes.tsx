
import React, { useState } from 'react';
import { Grid3X3, LayoutList, ClipboardList } from 'lucide-react';
import { useNotes } from '@/contexts/NotesContext';
import SearchBar from '@/components/ui/SearchBar';
import EmptyState from '@/components/shared/EmptyState';
import NoteCard from '@/components/notes/NoteCard';
import NoteEditor from '@/components/notes/NoteEditor';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type ViewMode = 'grid' | 'list';

const NotesPage: React.FC = () => {
  const {
    filteredNotes,
    activeNote,
    setActiveNote,
    updateNote,
    deleteNote,
    exportNoteToPdf,
    setSearchQuery,
    createNote,
  } = useNotes();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleSelectNote = (note: typeof filteredNotes[0]) => {
    setActiveNote(note);
  };
  
  const handleCloseEditor = () => {
    setActiveNote(null);
  };
  
  const handleSaveNote = (data: { title: string; content: string }) => {
    if (activeNote) {
      updateNote(activeNote.id, data);
    }
  };
  
  const handleCreateNote = () => {
    const newNote = createNote();
    setActiveNote(newNote);
  };
  
  const handleExportNote = (note: typeof filteredNotes[0]) => {
    exportNoteToPdf(note);
  };
  
  return (
    <div className="h-full flex flex-col sm:flex-row">
      {/* Notes list panel */}
      <div 
        className={`
          h-[300px] sm:h-full sm:max-w-md w-full border-r
          ${activeNote ? 'hidden sm:block' : 'flex flex-col'} 
          overflow-hidden transition-all duration-300
        `}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div className="font-medium">My Notes</div>
          
          <div className="flex gap-2">
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as ViewMode)}>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Grid3X3 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <LayoutList className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        
        <div className="px-4 py-3 border-b">
          <SearchBar 
            onSearch={handleSearch} 
            placeholder="Search notes..." 
          />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {filteredNotes.length > 0 ? (
            <div className={`
              gap-4
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2' 
                : 'flex flex-col'}
            `}>
              {filteredNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => handleSelectNote(note)}
                  onDelete={() => deleteNote(note.id)}
                  onExport={() => handleExportNote(note)}
                  isActive={activeNote?.id === note.id}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<ClipboardList className="h-8 w-8" />}
              title="No notes found"
              description="Create your first note or try a different search."
              action={{
                label: "Create Note",
                onClick: handleCreateNote
              }}
              className="h-full"
            />
          )}
        </div>
      </div>
      
      {/* Note editor panel */}
      {activeNote ? (
        <div className="flex-1 overflow-hidden flex flex-col animate-fade-in">
          <NoteEditor
            note={activeNote}
            onSave={handleSaveNote}
            onClose={handleCloseEditor}
            onExport={() => handleExportNote(activeNote)}
          />
        </div>
      ) : (
        <div className="hidden sm:flex flex-1 items-center justify-center">
          <EmptyState
            icon={<ClipboardList className="h-12 w-12" />}
            title="No note selected"
            description="Select a note from the list or create a new one."
            action={{
              label: "Create Note",
              onClick: handleCreateNote
            }}
          />
        </div>
      )}
    </div>
  );
};

export default NotesPage;
