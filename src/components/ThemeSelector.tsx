import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Palmtree, Trees, Castle, Building2, Sun, Moon } from "lucide-react";
import { Card } from "@/components/ui/card";
import forestDay from "@/assets/forest-day.jpg";
import forestNight from "@/assets/forest-night.jpg";
import beachDay from "@/assets/beach-day.jpg";
import beachNight from "@/assets/beach-night.jpg";
import ruinsDay from "@/assets/ruins-day.jpg";
import ruinsNight from "@/assets/ruins-night.jpg";
import cityDay from "@/assets/city-day.jpg";
import cityNight from "@/assets/city-night.jpg";

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
        backgroundImage: forestDay,
      },
      night: {
        backgroundImage: forestNight,
      },
    },
    beach: {
      day: {
        backgroundImage: beachDay,
      },
      night: {
        backgroundImage: beachNight,
      },
    },
    ruins: {
      day: {
        backgroundImage: ruinsDay,
      },
      night: {
        backgroundImage: ruinsNight,
      },
    },
    city: {
      day: {
        backgroundImage: cityDay,
      },
      night: {
        backgroundImage: cityNight,
      },
    },
  };

  return themes[theme][timeMode];
};

export const getThemeSound = (theme: ThemeType, timeMode: TimeMode = "day") => {
  // Ambient sounds for each theme and time of day
  // Using verified working audio URLs from reliable sources
  const sounds: Record<ThemeType, Record<TimeMode, string>> = {
    forest: {
      day: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_1ac5d4c9f1.mp3", // Forest birds and ambience
      night: "https://cdn.pixabay.com/download/audio/2022/05/09/audio_4e8e6faf87.mp3", // Night forest with crickets
    },
    beach: {
      day: "https://cdn.pixabay.com/download/audio/2022/03/07/audio_8bdcb53d08.mp3", // Gentle beach waves
      night: "https://cdn.pixabay.com/download/audio/2023/07/06/audio_6c6fa88ba9.mp3", // Ocean waves at night
    },
    ruins: {
      day: "https://cdn.pixabay.com/download/audio/2022/04/01/audio_eb5b1088f1.mp3", // Wind through ruins
      night: "https://cdn.pixabay.com/download/audio/2023/02/13/audio_a3c3f1f977.mp3", // Mysterious wind at night
    },
    city: {
      day: "https://cdn.pixabay.com/download/audio/2022/03/09/audio_0e3b26f626.mp3", // Busy city ambience
      night: "https://cdn.pixabay.com/download/audio/2023/06/21/audio_85d4bb7236.mp3", // Peaceful city night rain
    },
  };

  return sounds[theme][timeMode];
};
