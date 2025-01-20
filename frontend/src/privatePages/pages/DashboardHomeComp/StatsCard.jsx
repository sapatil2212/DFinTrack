import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Users, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

export default function StatsCard({ title, value, change, icon: Icon }) {
  const isPositive = change && change.value > 0;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="flex justify-between p-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="flex items-center text-xs">
            <span
              className={cn(
                "mr-1 font-medium",
                isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              {isPositive ? "+" : ""}
              {change ? change.value : "0"}%
            </span>
            <span className="text-muted-foreground">
              than last {change ? change.timeframe : "N/A"}
            </span>
          </p>
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 p-2 text-primary flex items-center justify-center">
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}
