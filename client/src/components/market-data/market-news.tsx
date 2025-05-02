import { useMarketNews } from "@/hooks/use-market-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function MarketNews() {
  const { data: news, isLoading, error } = useMarketNews();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Market News</CardTitle>
          <CardDescription>Latest news from the financial markets</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Market News</CardTitle>
          <CardDescription>Latest news from the financial markets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <p className="text-destructive mb-2">Error loading market news</p>
            <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : String(error)}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Market News</CardTitle>
        <CardDescription>Latest news from the financial markets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 overflow-auto max-h-[500px]">
        {news && news.length > 0 ? (
          news.map((item: any) => (
            <div key={item.id} className="pb-4 border-b last:border-0">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h3 className="font-medium">{item.title}</h3>
                <Badge variant="outline" className="shrink-0">
                  {item.source}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {format(new Date(item.datetime), 'MMM d, yyyy h:mm a')}
              </p>
              <p className="text-sm mb-3">{item.summary}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => window.open(item.url, '_blank')}
              >
                Read Full Story <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-center p-4">
            <p className="text-muted-foreground">No market news available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
