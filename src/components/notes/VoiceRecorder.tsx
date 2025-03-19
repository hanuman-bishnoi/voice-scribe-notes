
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface VoiceRecorderProps {
  onTranscriptionChange: (text: string) => void;
  initialText?: string;
  className?: string;
}

// Language options for speech recognition
const languageOptions = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'pt-BR', name: 'Portuguese' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'hi-IN', name: 'Hindi' },
];

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptionChange,
  initialText = '',
  className,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [transcript, setTranscript] = useState(initialText);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const startRecording = async () => {
    setIsInitializing(true);
    setErrorMessage(null);
    
    try {
      // Check if browser supports SpeechRecognition
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        throw new Error('Speech recognition is not supported in this browser');
      }
      
      // Create speech recognition instance
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      
      // Configure recognition
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = selectedLanguage.code;
      
      // Set up event handlers
      recognitionRef.current.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        
        setTranscript(currentTranscript);
        onTranscriptionChange(currentTranscript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setErrorMessage(`Error: ${event.error}`);
        stopRecording();
      };
      
      recognitionRef.current.onend = () => {
        // If we're still supposed to be recording, restart
        if (isRecording && recognitionRef.current) {
          recognitionRef.current.start();
        }
      };
      
      // Start recording
      recognitionRef.current.start();
      setIsRecording(true);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsInitializing(false);
    }
  };
  
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const handleLanguageChange = (language: typeof languageOptions[0]) => {
    setSelectedLanguage(language);
    
    // If currently recording, restart with new language
    if (isRecording) {
      stopRecording();
      setTimeout(() => startRecording(), 100);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={toggleRecording}
          variant={isRecording ? "destructive" : "default"}
          size="lg"
          className="rounded-full w-14 h-14 p-0 transition-all duration-300 transform hover:scale-105"
          disabled={isInitializing}
        >
          {isInitializing ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isRecording ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Globe className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto">
            {languageOptions.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className={cn(
                  'cursor-pointer',
                  selectedLanguage.code === language.code && 'bg-primary/10'
                )}
              >
                {language.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="text-xs font-medium">
        {isRecording ? (
          <span className="text-destructive">Recording in {selectedLanguage.name}...</span>
        ) : (
          <span className="text-muted-foreground">Tap to record</span>
        )}
      </div>
      
      {errorMessage && (
        <div className="text-destructive text-sm mt-2">{errorMessage}</div>
      )}
    </div>
  );
};

export default VoiceRecorder;
