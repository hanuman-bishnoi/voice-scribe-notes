
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mic, Search, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedLogo from '@/components/shared/AnimatedLogo';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="space-y-2">
            <div className="inline-block">
              <AnimatedLogo size="lg" />
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl animate-fade-in">
              VoiceScribe
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-4 animate-slide-in">
              Transform your thoughts into text effortlessly with our voice-to-text note-taking app.
              Just speak, and we'll do the rest.
            </p>
          </div>
          
          <div>
            <Button 
              onClick={() => navigate('/notes')} 
              size="lg" 
              className="animate-slide-in rounded-full px-8 gap-2"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Features section */}
      <div className="py-12 px-6">
        <h2 className="text-2xl font-semibold text-center mb-8">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <FeatureCard 
            icon={<Mic />} 
            title="Voice-to-Text" 
            description="Dictate your notes naturally and watch them appear on screen in real-time."
          />
          
          <FeatureCard 
            icon={<FileText />} 
            title="Organize Notes" 
            description="Create, edit, and manage your notes with our intuitive interface."
          />
          
          <FeatureCard 
            icon={<Search />} 
            title="Quick Search" 
            description="Find exactly what you need with powerful search capabilities."
          />
          
          <FeatureCard 
            icon={<Download />} 
            title="Export Options" 
            description="Save your notes as text files for use in other applications."
          />
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="premium-card h-full transition-all duration-300 hover:shadow-lg animate-fade-in">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="p-3 bg-primary/10 rounded-full text-primary">
          {icon}
        </div>
        <h3 className="font-medium text-lg mt-4 mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Index;
