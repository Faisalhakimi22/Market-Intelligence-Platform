import { useEconomicEvents } from "@/hooks/use-market-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertTriangle, Check } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function EconomicEvents() {
  const { data: events, isLoading, error } = useEconomicEvents();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Economic Calendar</CardTitle>
          <CardDescription>Upcoming high-impact economic events</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    let displayMessage = errorMessage;
    let actionMessage = "";

    // Provide more specific messages for different error cases
    if (errorMessage.includes("premium") || errorMessage.includes("access") || errorMessage.includes("restricted")) {
      displayMessage = "Premium API access required";
      actionMessage = "The economic calendar data requires a premium Finnhub subscription.";
    } else if (errorMessage.includes("API key not configured")) {
      displayMessage = "Finnhub API key is missing or invalid";
      actionMessage = "Please configure a valid Finnhub API key to access economic events data.";
    }

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Economic Calendar</CardTitle>
          <CardDescription>Upcoming high-impact economic events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <p className="text-destructive mb-2">Error loading economic events</p>
            <p className="text-sm text-muted-foreground mb-2">{displayMessage}</p>
            {actionMessage && <p className="text-xs text-muted-foreground">{actionMessage}</p>}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Economic Calendar</CardTitle>
        <CardDescription>Upcoming high-impact economic events</CardDescription>
      </CardHeader>
      <CardContent>
        {events && Array.isArray(events) && events.length > 0 ? (
          <div className="grid gap-3">
            {events.map((event: any) => (
              <div key={event.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">{event.event}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.country} · {event.datetime ? format(new Date(event.datetime), 'MMM d, yyyy') : 'TBA'}
                    </div>
                  </div>
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> High Impact
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Previous</div>
                    <div className="font-medium">{event.previous || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Forecast</div>
                    <div className="font-medium">{event.estimate || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Actual</div>
                    <div className="font-medium flex items-center gap-1">
                      {event.actual ? (
                        <>
                          {event.actual}
                          <Check className="h-3 w-3 text-green-600" />
                        </>
                      ) : (
                        'Pending'
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4">
            <p className="text-muted-foreground">No upcoming economic events</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
