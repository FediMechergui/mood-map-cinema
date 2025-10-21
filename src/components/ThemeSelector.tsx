import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Palmtree, Trees, Castle, Building2, Sun, Moon } from "lucide-react";
import { Card } from "@/components/ui/card";

export type ThemeType = "forest" | "beach" | "ruins" | "city";
export type TimeMode = "day" | "night";

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
  timeMode: TimeMode;
}

const themes = [
  { value: "forest" as ThemeType, label: "Forest", icon: Trees },
  { value: "beach" as ThemeType, label: "Beach", icon: Palmtree },
  { value: "ruins" as ThemeType, label: "Ruins", icon: Castle },
  { value: "city" as ThemeType, label: "City", icon: Building2 },
];

export const ThemeSelector = ({ currentTheme, onThemeChange, timeMode }: ThemeSelectorProps) => {
  return (
    <Card className="fixed top-6 right-6 z-50 bg-white/40 backdrop-blur-md rounded-3xl p-4 shadow-[0_8px_32px_hsl(140_25%_55%/0.15)] border border-white/20">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-center gap-2 pb-2 border-b border-primary/10">
          {timeMode === "day" ? (
            <Sun className="w-5 h-5 text-secondary" />
          ) : (
            <Moon className="w-5 h-5 text-accent" />
          )}
          <span className="text-sm font-semibold text-foreground">
            {timeMode === "day" ? "Daytime" : "Nighttime"}
          </span>
        </div>
        
        <div className="flex flex-col gap-2">
          <span className="text-xs text-muted-foreground font-medium text-center">Choose Mood</span>
          {themes.map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              onClick={() => onThemeChange(value)}
              variant={currentTheme === value ? "default" : "ghost"}
              className={`rounded-2xl justify-start gap-2 transition-all ${
                currentTheme === value
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-primary/10 text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export const getThemeStyles = (theme: ThemeType, timeMode: TimeMode) => {
  const themes = {
    forest: {
      day: {
        background: "linear-gradient(135deg, hsl(140 35% 85%) 0%, hsl(140 30% 75%) 50%, hsl(140 25% 65%) 100%)",
        overlay: "radial-gradient(circle at 30% 20%, hsl(140 40% 50% / 0.1) 0%, transparent 50%)",
      },
      night: {
        background: "linear-gradient(135deg, hsl(140 20% 15%) 0%, hsl(140 25% 12%) 50%, hsl(140 30% 8%) 100%)",
        overlay: "radial-gradient(circle at 70% 30%, hsl(195 40% 30% / 0.2) 0%, transparent 50%)",
      },
    },
    beach: {
      day: {
        background: "linear-gradient(135deg, hsl(195 60% 85%) 0%, hsl(42 50% 80%) 50%, hsl(42 60% 90%) 100%)",
        overlay: "radial-gradient(circle at 50% 100%, hsl(195 50% 70% / 0.3) 0%, transparent 60%)",
      },
      night: {
        background: "linear-gradient(135deg, hsl(220 40% 20%) 0%, hsl(220 35% 15%) 50%, hsl(220 30% 10%) 100%)",
        overlay: "radial-gradient(circle at 50% 20%, hsl(220 50% 40% / 0.2) 0%, transparent 50%)",
      },
    },
    ruins: {
      day: {
        background: "linear-gradient(135deg, hsl(30 30% 75%) 0%, hsl(25 35% 65%) 50%, hsl(20 40% 60%) 100%)",
        overlay: "radial-gradient(circle at 40% 60%, hsl(25 30% 50% / 0.15) 0%, transparent 60%)",
      },
      night: {
        background: "linear-gradient(135deg, hsl(30 20% 20%) 0%, hsl(25 25% 15%) 50%, hsl(20 30% 12%) 100%)",
        overlay: "radial-gradient(circle at 60% 40%, hsl(280 30% 25% / 0.2) 0%, transparent 50%)",
      },
    },
    city: {
      day: {
        background: "linear-gradient(135deg, hsl(200 30% 80%) 0%, hsl(210 25% 70%) 50%, hsl(220 20% 65%) 100%)",
        overlay: "radial-gradient(circle at 50% 50%, hsl(210 20% 60% / 0.15) 0%, transparent 70%)",
      },
      night: {
        background: "linear-gradient(135deg, hsl(220 30% 18%) 0%, hsl(230 35% 12%) 50%, hsl(240 40% 8%) 100%)",
        overlay: "radial-gradient(circle at 50% 100%, hsl(280 50% 30% / 0.25) 0%, transparent 60%)",
      },
    },
  };

  return themes[theme][timeMode];
};

export const getThemeSound = (theme: ThemeType) => {
  // Free ambient sounds from pixabay/freesound
  const sounds = {
    forest: "https://cdn.pixabay.com/audio/2022/03/10/audio_4f88cebf07.mp3", // Forest ambience
    beach: "https://cdn.pixabay.com/audio/2022/05/13/audio_4d188e1cb3.mp3", // Ocean waves
    ruins: "https://cdn.pixabay.com/audio/2022/10/26/audio_24f0e7c40c.mp3", // Wind ambience
    city: "https://cdn.pixabay.com/audio/2023/08/14/audio_0c0b364d4e.mp3", // City ambience
  };

  return sounds[theme];
};
