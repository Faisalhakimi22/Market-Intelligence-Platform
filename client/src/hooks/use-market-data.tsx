import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export function useCompanyProfile(symbol: string) {
  return useQuery({
    queryKey: [`/api/market/company/${symbol}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!symbol,
  });
}

export function useCompetitors(symbol: string) {
  return useQuery({
    queryKey: [`/api/market/competitors/${symbol}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!symbol,
  });
}

export function useIndustryPerformance() {
  return useQuery({
    queryKey: ["/api/market/industry-performance"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
}

export function useMarketNews() {
  return useQuery({
    queryKey: ["/api/market/news"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
}

export function useCompanyNews(symbol: string) {
  return useQuery({
    queryKey: [`/api/market/company-news/${symbol}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!symbol,
  });
}

export function useEconomicEvents() {
  return useQuery({
    queryKey: ["/api/market/economic-events"],
    queryFn: getQueryFn({ on401: "throw" }),
  });
}

export function useCompanySearch(query: string) {
  return useQuery({
    queryKey: [`/api/market/search?query=${query}`],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!query && query.length > 1,
  });
}
