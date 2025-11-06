import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface MovieCardProps {
  title: string;
  year: string;
  poster: string;
  rating: string;
  genre: string;
  plot: string;
}

export const MovieCard = ({ title, year, poster, rating, genre, plot }: MovieCardProps) => {
  return (
    <Card className="group overflow-hidden rounded-2xl md:rounded-3xl border-none bg-white/50 backdrop-blur-lg hover:bg-white/70 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl shadow-lg">
      <div className="relative overflow-hidden aspect-[2/3]">
        <img
          src={poster !== "N/A" ? poster : "https://via.placeholder.com/300x450?text=No+Poster"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {rating !== "N/A" && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-lg">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold">{rating}</span>
          </div>
        )}
      </div>
      
      <div className="p-4 md:p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base md:text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors flex-1">
            {title}
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {genre.split(", ").slice(0, 3).map((g) => (
            <Badge key={g} variant="secondary" className="rounded-full bg-primary/15 text-primary border-none text-xs">
              {g}
            </Badge>
          ))}
          <Badge variant="outline" className="rounded-full border-primary/30 text-xs">
            {year}
          </Badge>
        </div>
        
        <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {plot !== "N/A" ? plot : "No description available."}
        </p>
      </div>
    </Card>
  );
};
