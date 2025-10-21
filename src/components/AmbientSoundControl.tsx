import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface AmbientSoundControlProps {
  soundUrl: string;
}

export const AmbientSoundControl = ({ soundUrl }: AmbientSoundControlProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([30]);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume[0] / 100;
    }

    // Update source when soundUrl changes
    if (audioRef.current.src !== soundUrl) {
      const wasPlaying = isPlaying;
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current.src = soundUrl;
      audioRef.current.load();
      
      if (wasPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [soundUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        setNeedsInteraction(false);
        toast.success("Ambient sounds playing", { duration: 2000 });
      }
    } catch (error) {
      console.error("Audio playback failed:", error);
      toast.error("Click to enable ambient sounds", { duration: 3000 });
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div 
        className="flex items-center gap-3 bg-white/40 backdrop-blur-md rounded-full px-4 py-3 shadow-[0_8px_32px_hsl(140_25%_55%/0.15)] border border-white/20 transition-all"
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
      >
        <Button
          size="icon"
          variant="ghost"
          onClick={togglePlay}
          className={`rounded-full transition-all ${
            isPlaying 
              ? "bg-primary/20 text-primary hover:bg-primary/30" 
              : needsInteraction 
              ? "bg-secondary/20 text-secondary hover:bg-secondary/30 animate-pulse" 
              : "hover:bg-primary/20"
          }`}
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5" />
          ) : needsInteraction ? (
            <Play className="w-5 h-5" />
          ) : (
            <VolumeX className="w-5 h-5" />
          )}
        </Button>
        
        {(showVolumeSlider || isPlaying) && isPlaying && (
          <div className="w-24 animate-fade-in">
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="cursor-pointer"
            />
          </div>
        )}
      </div>
      
      {needsInteraction && !isPlaying && (
        <div className="absolute bottom-full right-0 mb-2 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg text-sm text-foreground whitespace-nowrap animate-fade-in border border-primary/20">
          Click to start ambient sounds 🎵
        </div>
      )}
    </div>
  );
};
