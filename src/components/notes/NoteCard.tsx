
import React from 'react';
import { FileText, MoreVertical, Download, Edit, Trash2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Note } from '@/contexts/NotesContext';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onDelete: () => void;
  onExport: () => void;
  className?: string;
  isActive?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onClick,
  onDelete,
  onExport,
  className,
  isActive = false,
}) => {
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get language name from language code
  const getLanguageName = (code?: string) => {
    if (!code) return null;
    
    // Common language codes and their names
    const languages: Record<string, string> = {
      'en-US': 'English (US)',
      'en-GB': 'English (UK)',
      'es-ES': 'Spanish',
      'fr-FR': 'French',
      'de-DE': 'German',
      'it-IT': 'Italian',
      'pt-BR': 'Portuguese',
      'ja-JP': 'Japanese',
      'ko-KR': 'Korean',
      'zh-CN': 'Chinese',
      'hi-IN': 'Hindi',
    };
    
    return languages[code] || code;
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  // Prevent card click when clicking dropdown
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      className={cn(
        'premium-card transition-all duration-300 cursor-pointer hover:shadow-lg',
        isActive && 'ring-2 ring-primary',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium line-clamp-1">{note.title || 'Untitled Note'}</h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={handleDropdownClick}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onClick}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {truncateContent(note.content) || 'No content'}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
        <span>{formatDate(note.updatedAt)}</span>
        {note.language && note.language !== 'en-US' && (
          <div className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            <span>{getLanguageName(note.language)}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
