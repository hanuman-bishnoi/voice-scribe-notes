
import React, { useState, useEffect, useRef } from 'react';
import { SaveIcon, X, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import VoiceRecorder from './VoiceRecorder';
import type { Note } from '@/contexts/NotesContext';

interface NoteEditorProps {
  note: Note | null;
  onSave: (data: { title: string; content: string; language?: string }) => void;
  onClose: () => void;
  onExport: () => void;
  className?: string;
}

const AUTO_SAVE_INTERVAL = 5000; // 5 seconds

const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onSave,
  onClose,
  onExport,
  className,
}) => {
  const [title, setTitle] = useState(note?.title || 'Untitled Note');
  const [content, setContent] = useState(note?.content || '');
  const [isModified, setIsModified] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update local state when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setIsModified(false);
      setLastSaved(note.updatedAt ? new Date(note.updatedAt) : null);
    }
  }, [note]);
  
  // Set up auto-save timer
  useEffect(() => {
    if (isModified && note) {
      // Clear any existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // Set new timer for auto-save
      autoSaveTimerRef.current = setTimeout(() => {
        handleSave();
      }, AUTO_SAVE_INTERVAL);
    }
    
    // Cleanup timer on unmount or when modified state changes
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [isModified, title, content]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsModified(true);
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsModified(true);
  };
  
  const handleVoiceInput = (transcript: string) => {
    setContent(transcript);
    setIsModified(true);
  };
  
  const handleSave = () => {
    onSave({ title, content });
    setIsModified(false);
    setLastSaved(new Date());
  };
  
  // Auto-save on component unmount if modified
  useEffect(() => {
    return () => {
      if (isModified) {
        onSave({ title, content });
      }
    };
  }, [isModified, onSave, title, content]);
  
  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex items-center justify-between p-4 border-b">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Note title"
          className="text-lg font-medium border-0 p-0 h-auto focus-visible:ring-0"
        />
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onExport}
            title="Export note"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          <Button
            variant={isModified ? "default" : "ghost"}
            size="sm"
            onClick={handleSave}
            disabled={!isModified}
            className={cn(
              "transition-all",
              isModified ? "animate-pulse-gentle" : ""
            )}
          >
            <SaveIcon className="h-4 w-4 mr-1" />
            Save
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            title="Close editor"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing or use voice recording..."
          className="flex-1 resize-none p-4 border-0 rounded-none focus-visible:ring-0"
        />
      </div>
      
      {lastSaved && (
        <div className="text-xs text-muted-foreground px-4 py-1 border-t">
          {isModified ? "Modified" : `Last saved: ${lastSaved.toLocaleTimeString()}`}
        </div>
      )}
      
      <div className="border-t p-4 flex justify-center">
        <VoiceRecorder 
          onTranscriptionChange={handleVoiceInput} 
          initialText={content}
        />
      </div>
    </div>
  );
};

export default NoteEditor;
