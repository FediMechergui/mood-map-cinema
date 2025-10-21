import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MovieCard } from "@/components/MovieCard";
import { AmbientSoundControl } from "@/components/AmbientSoundControl";
import { FloatingLeaves } from "@/components/FloatingLeaves";
import { ThemeSelector, getThemeStyles, getThemeSound, ThemeType, TimeMode } from "@/components/ThemeSelector";
import { Loader2, MapPin, CloudRain, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

interface Movie {
  Title: string;
  Year: string;
  Poster: string;
  imdbRating: string;
  Genre: string;
  Plot: string;
}

interface LocationData {
  city: string;
  country: string;
}

interface WeatherData {
  description: string;
  temp: number;
}

const Index = () => {
  const [mood, setMood] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [lastWatched, setLastWatched] = useState("");
  const [favorite, setFavorite] = useState("");
  const [vibe, setVibe] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [lastWatchedSuggestions, setLastWatchedSuggestions] = useState<Movie[]>(
    []
  );
  const [favoriteSuggestions, setFavoriteSuggestions] = useState<Movie[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [backgroundTheme, setBackgroundTheme] = useState<ThemeType>("forest");
  const [timeMode, setTimeMode] = useState<TimeMode>("day");

  const moods = [
    "Happy",
    "Sad",
    "Adventurous",
    "Romantic",
    "Thoughtful",
    "Energetic",
    "Relaxed",
  ];
  const genreOptions = [
    "Action",
    "Comedy",
    "Drama",
    "Romance",
    "Thriller",
    "Sci-Fi",
    "Horror",
    "Documentary",
    "Animation",
    "Fantasy",
  ];

  useEffect(() => {
    fetchLocationAndWeather();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Determine day/night mode based on time
  useEffect(() => {
    const hour = currentTime.getHours();
    setTimeMode(hour >= 6 && hour < 18 ? "day" : "night");
  }, [currentTime]);

  const fetchLocationAndWeather = async () => {
    // Set Tunisia as default location
    setLocation({ city: "Tunis", country: "Tunisia" });

    // Fetch weather for Tunis, Tunisia
    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Tunis,TN&appid=YOUR_OPENWEATHERMAP_KEY&units=metric`
      );

      if (weatherRes.ok) {
        const weatherData = await weatherRes.json();
        setWeather({
          description: weatherData.weather[0].description,
          temp: Math.round(weatherData.main.temp),
        });
      }
    } catch (weatherError) {
      console.log("Weather data unavailable - API key needed");
      // Set demo weather data for Tunisia
      setWeather({
        description: "clear sky",
        temp: 22,
      });
    }
  };

  const toggleGenre = (genre: string) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const getRecommendations = async () => {
    if (!mood || genres.length === 0) {
      toast.error("Please select your mood and at least one genre!");
      return;
    }

    setLoading(true);
    setMovies([]);

    try {
      // Movie search terms based on mood and context
      const searchTerms = getMoodBasedSearchTerms(
        mood,
        genres,
        weather?.description
      );
      const moviePromises = searchTerms.map((term) =>
        fetch(`https://www.omdbapi.com/?apikey=dafdd708&s=${term}&type=movie`)
          .then((res) => res.json())
          .then((data) => data.Search || [])
      );

      const allResults = await Promise.all(moviePromises);
      const flatResults = allResults.flat();

      // Get detailed info for random selection
      const selectedMovies = flatResults
        .sort(() => Math.random() - 0.5)
        .slice(0, 8);

      const detailedPromises = selectedMovies.map((movie) =>
        fetch(
          `https://www.omdbapi.com/?apikey=dafdd708&i=${movie.imdbID}&plot=short`
        ).then((res) => res.json())
      );

      const detailedMovies = await Promise.all(detailedPromises);
      setMovies(detailedMovies.filter((m) => m.Response === "True"));

      toast.success(
        `Found ${detailedMovies.length} perfect movies for your mood!`
      );
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced suggestions for movie inputs
  useEffect(() => {
    const controller = new AbortController();
    const key = "dafdd708"; // existing OMDB key used in this file
    const fetchSuggestions = async (
      query: string,
      setter: (v: Movie[]) => void
    ) => {
      if (!query || query.trim().length < 2) {
        setter([]);
        return;
      }

      setSuggestionsLoading(true);
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${key}&s=${encodeURIComponent(
            query
          )}&type=movie`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (data && data.Search) {
          setter(
            data.Search.map((m: any) => ({
              Title: m.Title,
              Year: m.Year,
              Poster: m.Poster,
              imdbRating: m.imdbRating || "N/A",
              Genre: m.Type || "",
              Plot: m.Plot || "",
            }))
          );
        } else {
          setter([]);
        }
      } catch (e) {
        if ((e as any).name !== "AbortError") console.error(e);
        setter([]);
      } finally {
        setSuggestionsLoading(false);
      }
    };

    const lastTimer = setTimeout(
      () => fetchSuggestions(lastWatched, setLastWatchedSuggestions),
      350
    );
    const favTimer = setTimeout(
      () => fetchSuggestions(favorite, setFavoriteSuggestions),
      350
    );

    return () => {
      controller.abort();
      clearTimeout(lastTimer);
      clearTimeout(favTimer);
    };
  }, [lastWatched, favorite]);

  const applySuggestion = (value: string, type: "last" | "fav") => {
    if (type === "last") {
      setLastWatched(value);
      setLastWatchedSuggestions([]);
    } else {
      setFavorite(value);
      setFavoriteSuggestions([]);
    }
    setActiveSuggestionIndex(null);
  };

  const getMoodBasedSearchTerms = (
    mood: string,
    genres: string[],
    weather?: string
  ) => {
    const moodKeywords: Record<string, string[]> = {
      Happy: ["comedy", "adventure", "musical", "feel-good"],
      Sad: ["drama", "emotional", "meaningful", "touching"],
      Adventurous: ["adventure", "action", "exploration", "journey"],
      Romantic: ["romance", "love", "relationship", "romantic"],
      Thoughtful: ["drama", "philosophical", "mystery", "indie"],
      Energetic: ["action", "thriller", "fast-paced", "exciting"],
      Relaxed: ["calm", "peaceful", "slow-burn", "contemplative"],
    };

    const weatherKeywords: Record<string, string> = {
      rain: "cozy",
      clear: "adventure",
      clouds: "mystery",
      snow: "winter",
    };

    const baseTerms = [...(moodKeywords[mood] || []), ...genres.slice(0, 2)];

    if (weather) {
      const weatherTerm = Object.keys(weatherKeywords).find((key) =>
        weather.includes(key)
      );
      if (weatherTerm) baseTerms.push(weatherKeywords[weatherTerm]);
    }

    return baseTerms.slice(0, 6);
  };

  const getTimeOfDay = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  };

  const themeStyles = getThemeStyles(backgroundTheme, timeMode);

  return (
    <div className="min-h-screen relative overflow-hidden transition-all duration-1000">
      {/* Background image placed as an absolutely positioned img to avoid inline styles */}
      <img
        src={themeStyles.backgroundImage}
        alt="background"
        className="fixed inset-0 w-full h-full object-cover pointer-events-none -z-10"
      />
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000 bg-black/20" />

      <FloatingLeaves />
      <ThemeSelector
        currentTheme={backgroundTheme}
        onThemeChange={setBackgroundTheme}
        timeMode={timeMode}
      />
      <AmbientSoundControl soundUrl={getThemeSound(backgroundTheme)} />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <img
            src={logo}
            alt="Marwa's Mood Movies Cave"
            className="w-48 md:w-64 mx-auto mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Marwa's Mood Movies Cave
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover your perfect movie match based on your mood, the weather,
            and your vibe
          </p>
        </header>

        {/* Context Info - Positioned below header */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in">
          <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md rounded-full px-5 py-2.5 shadow-md border border-white/30">
            <Clock className="w-4 h-4 text-secondary" />
            <span className="text-sm font-semibold">
              {getTimeOfDay()} •{" "}
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {location && (
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md rounded-full px-5 py-2.5 shadow-md border border-white/30">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">
                {location.city}, {location.country}
              </span>
            </div>
          )}

          {weather && (
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md rounded-full px-5 py-2.5 shadow-md border border-white/30">
              <CloudRain className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold">
                {weather.temp}°C • {weather.description}
              </span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="max-w-4xl mx-auto mb-16 bg-white/40 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-[0_8px_32px_hsl(140_25%_55%/0.15)] border border-white/20 animate-fade-in">
          <div className="space-y-8">
            {/* Mood */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-foreground">
                How are you feeling?
              </Label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger className="rounded-2xl border-primary/20 bg-white/60 h-12">
                  <SelectValue placeholder="Select your mood" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl bg-white/95 backdrop-blur-md">
                  {moods.map((m) => (
                    <SelectItem key={m} value={m} className="rounded-xl">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Genres */}
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-foreground">
                What genres are calling to you?
              </Label>
              <div className="flex flex-wrap gap-3">
                {genreOptions.map((genre) => (
                  <label
                    key={genre}
                    className="flex items-center gap-2 bg-white/60 rounded-full px-4 py-2 cursor-pointer hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/20"
                  >
                    <Checkbox
                      checked={genres.includes(genre)}
                      onCheckedChange={() => toggleGenre(genre)}
                      className="rounded-md"
                    />
                    <span className="text-sm font-medium">{genre}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Last Watched */}
            <div className="space-y-3">
              <Label
                htmlFor="lastWatched"
                className="text-lg font-semibold text-foreground"
              >
                Last movie you watched
              </Label>
              <div className="relative">
                <Input
                  id="lastWatched"
                  value={lastWatched}
                  onChange={(e) => setLastWatched(e.target.value)}
                  onKeyDown={(e) => {
                    if (lastWatchedSuggestions.length === 0) return;
                    if (e.key === "ArrowDown") {
                      setActiveSuggestionIndex((i) =>
                        i === null
                          ? 0
                          : Math.min(lastWatchedSuggestions.length - 1, i + 1)
                      );
                    } else if (e.key === "ArrowUp") {
                      setActiveSuggestionIndex((i) =>
                        i === null
                          ? lastWatchedSuggestions.length - 1
                          : Math.max(0, i - 1)
                      );
                    } else if (
                      e.key === "Enter" &&
                      activeSuggestionIndex !== null
                    ) {
                      applySuggestion(
                        lastWatchedSuggestions[activeSuggestionIndex].Title,
                        "last"
                      );
                    }
                  }}
                  placeholder="e.g., Inception, The Shawshank Redemption..."
                  className="rounded-2xl border-primary/20 bg-white/60 h-12"
                />

                {lastWatchedSuggestions.length > 0 && (
                  <div className="absolute z-50 mt-2 w-full rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-white/20 max-h-64 overflow-auto">
                    {lastWatchedSuggestions.map((s, idx) => (
                      <button
                        key={`${s.Title}-${idx}`}
                        onClick={() => applySuggestion(s.Title, "last")}
                        className={`w-full text-left px-4 py-2 hover:bg-primary/10 transition-colors ${
                          activeSuggestionIndex === idx ? "bg-primary/10" : ""
                        }`}
                        onMouseEnter={() => setActiveSuggestionIndex(idx)}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              s.Poster !== "N/A"
                                ? s.Poster
                                : "/public/placeholder.svg"
                            }
                            alt={s.Title}
                            className="w-10 h-14 object-cover rounded"
                          />
                          <div>
                            <div className="font-semibold text-sm text-foreground">
                              {s.Title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {s.Year}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Favorite */}
            <div className="space-y-3">
              <Label
                htmlFor="favorite"
                className="text-lg font-semibold text-foreground"
              >
                Your all-time favorite movie
              </Label>
              <div className="relative">
                <Input
                  id="favorite"
                  value={favorite}
                  onChange={(e) => setFavorite(e.target.value)}
                  onKeyDown={(e) => {
                    if (favoriteSuggestions.length === 0) return;
                    if (e.key === "ArrowDown") {
                      setActiveSuggestionIndex((i) =>
                        i === null
                          ? 0
                          : Math.min(favoriteSuggestions.length - 1, i + 1)
                      );
                    } else if (e.key === "ArrowUp") {
                      setActiveSuggestionIndex((i) =>
                        i === null
                          ? favoriteSuggestions.length - 1
                          : Math.max(0, i - 1)
                      );
                    } else if (
                      e.key === "Enter" &&
                      activeSuggestionIndex !== null
                    ) {
                      applySuggestion(
                        favoriteSuggestions[activeSuggestionIndex].Title,
                        "fav"
                      );
                    }
                  }}
                  placeholder="e.g., Forrest Gump, The Godfather..."
                  className="rounded-2xl border-primary/20 bg-white/60 h-12"
                />

                {favoriteSuggestions.length > 0 && (
                  <div className="absolute z-50 mt-2 w-full rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-white/20 max-h-64 overflow-auto">
                    {favoriteSuggestions.map((s, idx) => (
                      <button
                        key={`${s.Title}-${idx}`}
                        onClick={() => applySuggestion(s.Title, "fav")}
                        className={`w-full text-left px-4 py-2 hover:bg-primary/10 transition-colors ${
                          activeSuggestionIndex === idx ? "bg-primary/10" : ""
                        }`}
                        onMouseEnter={() => setActiveSuggestionIndex(idx)}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              s.Poster !== "N/A"
                                ? s.Poster
                                : "/public/placeholder.svg"
                            }
                            alt={s.Title}
                            className="w-10 h-14 object-cover rounded"
                          />
                          <div>
                            <div className="font-semibold text-sm text-foreground">
                              {s.Title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {s.Year}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Vibe */}
            <div className="space-y-3">
              <Label
                htmlFor="vibe"
                className="text-lg font-semibold text-foreground"
              >
                I want something that feels like...
              </Label>
              <Input
                id="vibe"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder="e.g., a warm hug, an adrenaline rush, a deep conversation..."
                className="rounded-2xl border-primary/20 bg-white/60 h-12"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={getRecommendations}
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-[0_8px_20px_hsl(140_25%_55%/0.3)] hover:shadow-[0_12px_28px_hsl(140_25%_55%/0.4)] transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Finding your perfect movies...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Discover Movies
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Movie Results */}
        {movies.length > 0 && (
          <div className="max-w-7xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
              Your Personalized Recommendations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movies.map((movie, index) => (
                <div
                  key={`${movie.Title}-${index}`}
                  className="animate-fade-in"
                >
                  <MovieCard
                    title={movie.Title}
                    year={movie.Year}
                    poster={movie.Poster}
                    rating={movie.imdbRating}
                    genre={movie.Genre}
                    plot={movie.Plot}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-20 pb-8">
          <p className="text-muted-foreground">
            Made with <span className="text-destructive">❤️</span> for Marwa
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
