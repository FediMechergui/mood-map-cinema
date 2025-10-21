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
    <Card className="group overflow-hidden rounded-3xl border-none bg-white/40 backdrop-blur-md hover:bg-white/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_12px_40px_hsl(140_25%_55%/0.2)]">
      <div className="relative overflow-hidden aspect-[2/3]">
        <img
          src={poster !== "N/A" ? poster : "https://via.placeholder.com/300x450?text=No+Poster"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {rating !== "N/A" && (
            <div className="flex items-center gap-1 text-secondary shrink-0">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {genre.split(", ").slice(0, 3).map((g) => (
            <Badge key={g} variant="secondary" className="rounded-full bg-primary/10 text-primary border-none">
              {g}
            </Badge>
          ))}
          <Badge variant="outline" className="rounded-full border-muted-foreground/20">
            {year}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {plot !== "N/A" ? plot : "No description available."}
        </p>
      </div>
    </Card>
  );
};
