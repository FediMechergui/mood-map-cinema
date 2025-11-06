import { useState } from "react";
import { Palmtree, Trees, Castle, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import forestDay from "@/assets/forest-day.jpg";
import forestNight from "@/assets/forest-night.jpg";
import beachDay from "@/assets/beach-day.jpg";
import beachNight from "@/assets/beach-night.jpg";
import ruinsDay from "@/assets/ruins-day.jpg";
import ruinsNight from "@/assets/ruins-night.jpg";
import cityDay from "@/assets/city-day.jpg";
import cityNight from "@/assets/city-night.jpg";
import logoForest from "@/assets/logo-forest.png";
import logoBeach from "@/assets/logo-beach.png";
import logoRuins from "@/assets/logo-ruins.png";
import logoCity from "@/assets/logo-city.png";

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/30 backdrop-blur-md rounded-full p-3 shadow-lg border border-white/30 hover:bg-white/40 transition-all duration-300 hover:scale-105"
      >
        {currentTheme === "forest" && <Trees className="w-5 h-5 text-primary" />}
        {currentTheme === "beach" && <Palmtree className="w-5 h-5 text-primary" />}
        {currentTheme === "ruins" && <Castle className="w-5 h-5 text-primary" />}
        {currentTheme === "city" && <Building2 className="w-5 h-5 text-primary" />}
      </button>

      {isOpen && (
        <Card className="absolute top-16 right-0 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-white/40 min-w-[140px] animate-fade-in">
          <div className="flex flex-col gap-2">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => {
                  onThemeChange(value);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                  currentTheme === value
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-primary/10 text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export const getThemeStyles = (theme: ThemeType, timeMode: TimeMode) => {
  const themes = {
    forest: {
      day: { backgroundImage: forestDay, logo: logoForest, font: "font-forest" },
      night: { backgroundImage: forestNight, logo: logoForest, font: "font-forest" },
    },
    beach: {
      day: { backgroundImage: beachDay, logo: logoBeach, font: "font-beach" },
      night: { backgroundImage: beachNight, logo: logoBeach, font: "font-beach" },
    },
    ruins: {
      day: { backgroundImage: ruinsDay, logo: logoRuins, font: "font-ruins" },
      night: { backgroundImage: ruinsNight, logo: logoRuins, font: "font-ruins" },
    },
    city: {
      day: { backgroundImage: cityDay, logo: logoCity, font: "font-city" },
      night: { backgroundImage: cityNight, logo: logoCity, font: "font-city" },
    },
  };

  return themes[theme][timeMode];
};

export const getThemeMood = (theme: ThemeType): string[] => {
  const themeMoods: Record<ThemeType, string[]> = {
    forest: ["peaceful", "natural", "contemplative", "serene", "organic"],
    beach: ["relaxed", "carefree", "breezy", "vacation", "light"],
    ruins: ["mysterious", "ancient", "thoughtful", "epic", "historical"],
    city: ["energetic", "modern", "fast-paced", "urban", "vibrant"],
  };
  return themeMoods[theme];
};

