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
