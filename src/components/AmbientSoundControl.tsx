import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export const AmbientSoundControl = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState([50]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Using a free forest ambience sound from pixabay
    audioRef.current = new Audio("https://cdn.pixabay.com/audio/2022/03/10/audio_4f88cebf07.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = volume[0] / 100;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(() => {
          // Handle autoplay restrictions
          console.log("Autoplay prevented. User interaction required.");
        });
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white/40 backdrop-blur-md rounded-full px-4 py-3 shadow-[0_8px_32px_hsl(140_25%_55%/0.15)] border border-white/20">
      <Button
        size="icon"
        variant="ghost"
        onClick={toggleMute}
        className="rounded-full hover:bg-primary/20 hover:text-primary transition-colors"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </Button>
      
      {!isMuted && (
        <div className="w-24">
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
  );
};
