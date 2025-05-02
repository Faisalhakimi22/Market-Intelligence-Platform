import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

export function useCompanyProfile(symbol: string) {
  return useQuery({
    queryKey: ["/api/market/company", symbol],
    queryFn: getQueryFn(),
    enabled: !!symbol,
  });
}

export function useCompetitors(symbol: string) {
  return useQuery({
    queryKey: ["/api/market/competitors", symbol],
    queryFn: getQueryFn(),
    enabled: !!symbol,
  });
}

export function useIndustryPerformance() {
  return useQuery({
    queryKey: ["/api/market/industry-performance"],
    queryFn: getQueryFn(),
  });
}

export function useMarketNews() {
  return useQuery({
    queryKey: ["/api/market/news"],
    queryFn: getQueryFn(),
  });
}

export function useCompanyNews(symbol: string) {
  return useQuery({
    queryKey: ["/api/market/company-news", symbol],
    queryFn: getQueryFn(),
    enabled: !!symbol,
  });
}

export function useEconomicEvents() {
  return useQuery({
    queryKey: ["/api/market/economic-events"],
    queryFn: getQueryFn(),
  });
}

export function useCompanySearch(query: string) {
  return useQuery({
    queryKey: ["/api/market/search", query],
    queryFn: getQueryFn(),
    enabled: !!query && query.length > 1,
  });
}
