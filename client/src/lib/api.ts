// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://market-intelligence-platform-production.up.railway.app';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Use either the environment variable or the hardcoded URL
  const baseUrl = API_BASE_URL.trim().replace(/\/+$/, "");
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  console.log(`Making API request to: ${url}`); // Debug log
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include',
  });
  
  let responseBody: any = null;
  try {
    responseBody = await response.json();
  } catch (error) {
    console.error("Error parsing response:", error);
    throw new Error(`Failed to parse API response: ${error}`);
  }
  
  if (!response.ok) {
    console.error(`API error: ${response.status} ${response.statusText}`, responseBody);
    const error = new Error(
      responseBody?.message || `API error: ${response.status} ${response.statusText}`
    );
    throw Object.assign(error, {
      status: response.status,
      data: responseBody,
    });
  }
  
  return responseBody;
}