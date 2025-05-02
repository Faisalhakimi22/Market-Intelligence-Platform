import * as ss from 'simple-statistics';
import { Matrix } from 'ml-matrix';

interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
}

interface ForecastResult {
  forecast: TimeSeriesDataPoint[];
  upperBound?: TimeSeriesDataPoint[];
  lowerBound?: TimeSeriesDataPoint[];
  modelName: string;
  rmse?: number;
  mape?: number;
}

/**
 * Forecasting service for time series analysis and prediction
 * 
 * Implements ARIMA (AutoRegressive Integrated Moving Average) models
 * for demand forecasting and trend predictions
 */
class ForecastingService {
  
  /**
   * Creates synthetic historical data for testing when real data is not available
   * @param {number} size - Number of data points
   * @param {string} interval - Interval between data points ('day', 'week', 'month')
   * @param {number} initialValue - Starting value
   * @param {number} trend - Trend factor (positive for upward, negative for downward)
   * @param {number} seasonality - Seasonality factor
   * @param {number} noise - Random noise factor
   */
  generateHistoricalData(size: number, interval: string, initialValue = 1000, trend = 10, seasonality = 0.2, noise = 0.05): TimeSeriesDataPoint[] {
    const data: TimeSeriesDataPoint[] = [];
    const now = new Date();
    
    for (let i = 0; i < size; i++) {
      const date = new Date(now.getTime());
      
      // Move backward in time based on interval
      if (interval === 'day') {
        date.setDate(date.getDate() - (size - i));
      } else if (interval === 'week') {
        date.setDate(date.getDate() - (size - i) * 7);
      } else { // month
        date.setMonth(date.getMonth() - (size - i));
      }
      
      // Calculate value with trend, seasonality, and noise
      const trendComponent = initialValue + trend * i;
      const seasonalComponent = Math.sin((i / (size / 6)) * Math.PI) * seasonality * trendComponent;
      const noiseComponent = (Math.random() - 0.5) * noise * 2 * trendComponent;
      
      const value = Math.max(0, trendComponent + seasonalComponent + noiseComponent);
      
      data.push({
        timestamp: date.toISOString(),
        value: Math.round(value)
      });
    }
    
    return data;
  }
  
  /**
   * Creates forecast data for a particular industry
   * @param {number} industryId - ID of the industry
   * @param {string} interval - Time interval ('day', 'week', 'month')
   * @param {number} periods - Number of periods to forecast
   */
  async getIndustryForecast(industryId: number, interval: string, periods: number): Promise<{ industry: string; historicalData: TimeSeriesDataPoint[]; forecast: ForecastResult }> {
    // Get industry data from database or external API
    // In a real implementation, this would be fetched from a database
    const industryNames = [
      'Healthcare', 'Technology', 'Education', 'Finance', 'Real Estate',
      'Manufacturing', 'Retail', 'Transportation', 'Energy', 'Agriculture'
    ];
    
    const industryName = industryNames[industryId - 1] || 'Unknown Industry';
    
    // Generate historical data
    // In a real implementation, this would be fetched from a market data API
    const dataPoints = interval === 'day' ? 60 : interval === 'week' ? 52 : 36;
    const historicalData = this.generateHistoricalData(dataPoints, interval);
    
    // Apply ARIMA forecasting
    const forecast = this.arima(historicalData, periods, interval);
    
    return {
      industry: industryName,
      historicalData,
      forecast
    };
  }
  
  /**
   * Compare different forecasting models on the same dataset
   * @param {string} interval - Time interval ('day', 'week', 'month')
   * @param {number} periods - Number of periods to forecast
   * @param {number} dataPoints - Number of historical data points
   */
  async compareModels(interval: string, periods: number, dataPoints: number): Promise<{ data: TimeSeriesDataPoint[]; models: ForecastResult[] }> {
    // Generate historical data
    const historicalData = this.generateHistoricalData(dataPoints, interval);
    
    // Create forecasts with different models
    const arimaForecast = this.arima(historicalData, periods, interval);
    const holtwintersForecast = this.holtWinters(historicalData, periods, interval);
    const linearRegressionForecast = this.linearRegression(historicalData, periods, interval);
    
    return {
      data: historicalData,
      models: [arimaForecast, holtwintersForecast, linearRegressionForecast]
    };
  }
  
  /**
   * Implements ARIMA (AutoRegressive Integrated Moving Average) forecasting
   * @param {TimeSeriesDataPoint[]} data - Historical time series data
   * @param {number} periods - Number of periods to forecast
   * @param {string} interval - Time interval ('day', 'week', 'month')
   */
  arima(data: TimeSeriesDataPoint[], periods: number, interval: string): ForecastResult {
    // Extract values from time series data
    const values = data.map(d => d.value);
    
    // Differencing for stationarity (the 'I' in ARIMA)
    const diff = this.difference(values, 1);
    
    // Determine AR parameters
    const arCoefficients = this.calculateARCoefficients(diff, 2); // p=2
    
    // Determine MA parameters
    const maCoefficients = this.calculateMACoefficients(diff, 1); // q=1
    
    // Generate forecast
    const forecast: TimeSeriesDataPoint[] = [];
    const forecastValues: number[] = [];
    
    // Use last observations and errors for forecasting
    const observations = [...values.slice(-3)];
    const errors = diff.slice(-2);
    
    let lastTimestamp = new Date(data[data.length - 1].timestamp);
    
    for (let i = 0; i < periods; i++) {
      // Move to next interval
      const nextDate = new Date(lastTimestamp.getTime());
      if (interval === 'day') {
        nextDate.setDate(nextDate.getDate() + 1);
      } else if (interval === 'week') {
        nextDate.setDate(nextDate.getDate() + 7);
      } else { // month
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      lastTimestamp = nextDate;
      
      // Calculate forecast using AR and MA terms
      let forecastValue = observations[observations.length - 1];
      
      // AR component
      for (let j = 0; j < arCoefficients.length; j++) {
        if (observations.length > j) {
          forecastValue += arCoefficients[j] * observations[observations.length - 1 - j];
        }
      }
      
      // MA component
      for (let j = 0; j < maCoefficients.length; j++) {
        if (errors.length > j) {
          forecastValue += maCoefficients[j] * errors[errors.length - 1 - j];
        }
      }
      
      // Add random noise component (small amount)
      const noise = forecastValue * 0.01 * (Math.random() - 0.5);
      forecastValue += noise;
      forecastValue = Math.max(0, forecastValue); // Ensure non-negative values
      
      // Add to observations for next iteration
      observations.push(forecastValue);
      observations.shift(); // Remove oldest observation
      errors.push(noise);
      errors.shift(); // Remove oldest error
      
      forecastValues.push(forecastValue);
      forecast.push({
        timestamp: nextDate.toISOString(),
        value: Math.round(forecastValue)
      });
    }
    
    // Calculate confidence intervals (upper/lower bounds)
    const stdDev = ss.standardDeviation(values);
    const upperBound = forecast.map(point => ({
      timestamp: point.timestamp,
      value: Math.round(point.value + 1.96 * stdDev)
    }));
    
    const lowerBound = forecast.map(point => ({
      timestamp: point.timestamp,
      value: Math.max(0, Math.round(point.value - 1.96 * stdDev))
    }));
    
    // Calculate error metrics
    const rmse = this.calculateRMSE(values, forecastValues);
    const mape = this.calculateMAPE(values, forecastValues);
    
    return {
      forecast,
      upperBound,
      lowerBound,
      modelName: 'ARIMA(2,1,1)',
      rmse,
      mape
    };
  }
  
  /**
   * Implements Holt-Winters (Triple Exponential Smoothing) forecasting
   * @param {TimeSeriesDataPoint[]} data - Historical time series data
   * @param {number} periods - Number of periods to forecast
   * @param {string} interval - Time interval ('day', 'week', 'month')
   */
  holtWinters(data: TimeSeriesDataPoint[], periods: number, interval: string): ForecastResult {
    // Extract values from time series data
    const values = data.map(d => d.value);
    
    // Determine seasonality period based on interval
    const seasonalPeriod = interval === 'day' ? 7 : interval === 'week' ? 4 : 12;
    
    // Initialize level, trend, and seasonal components
    let level = values[0];
    let trend = (values[1] - values[0]) / 1;
    
    // Seasonal components initialization
    const seasonal: number[] = [];
    for (let i = 0; i < seasonalPeriod; i++) {
      if (i < values.length) {
        seasonal.push(values[i] / level);
      } else {
        seasonal.push(1.0); // Default seasonal factor
      }
    }
    
    // Smoothing parameters (alpha, beta, gamma)
    const alpha = 0.3; // Level smoothing
    const beta = 0.2;  // Trend smoothing
    const gamma = 0.3; // Seasonal smoothing
    
    // Smooth the values
    for (let i = 1; i < values.length; i++) {
      const oldLevel = level;
      const oldTrend = trend;
      const oldSeasonal = seasonal[i % seasonalPeriod];
      
      // Update level
      level = alpha * (values[i] / seasonal[i % seasonalPeriod]) + (1 - alpha) * (oldLevel + oldTrend);
      
      // Update trend
      trend = beta * (level - oldLevel) + (1 - beta) * oldTrend;
      
      // Update seasonal component
      seasonal[i % seasonalPeriod] = gamma * (values[i] / level) + (1 - gamma) * oldSeasonal;
    }
    
    // Generate forecast
    const forecast: TimeSeriesDataPoint[] = [];
    const forecastValues: number[] = [];
    
    let lastTimestamp = new Date(data[data.length - 1].timestamp);
    
    for (let i = 0; i < periods; i++) {
      // Move to next interval
      const nextDate = new Date(lastTimestamp.getTime());
      if (interval === 'day') {
        nextDate.setDate(nextDate.getDate() + 1);
      } else if (interval === 'week') {
        nextDate.setDate(nextDate.getDate() + 7);
      } else { // month
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      lastTimestamp = nextDate;
      
      // Calculate forecast
      const forecastValue = (level + (i + 1) * trend) * seasonal[(values.length + i) % seasonalPeriod];
      forecastValues.push(forecastValue);
      
      forecast.push({
        timestamp: nextDate.toISOString(),
        value: Math.max(0, Math.round(forecastValue))
      });
    }
    
    // Calculate confidence intervals
    const stdDev = ss.standardDeviation(values);
    const upperBound = forecast.map(point => ({
      timestamp: point.timestamp,
      value: Math.round(point.value + 1.96 * stdDev)
    }));
    
    const lowerBound = forecast.map(point => ({
      timestamp: point.timestamp,
      value: Math.max(0, Math.round(point.value - 1.96 * stdDev))
    }));
    
    // Calculate error metrics
    const rmse = this.calculateRMSE(values, forecastValues);
    const mape = this.calculateMAPE(values, forecastValues);
    
    return {
      forecast,
      upperBound,
      lowerBound,
      modelName: 'Holt-Winters',
      rmse,
      mape
    };
  }
  
  /**
   * Implements Linear Regression forecasting
   * @param {TimeSeriesDataPoint[]} data - Historical time series data
   * @param {number} periods - Number of periods to forecast
   * @param {string} interval - Time interval ('day', 'week', 'month')
   */
  linearRegression(data: TimeSeriesDataPoint[], periods: number, interval: string): ForecastResult {
    // Extract values from time series data
    const values = data.map(d => d.value);
    
    // Create x-coordinates (time steps)
    const x = Array.from({ length: values.length }, (_, i) => i);
    
    // Perform linear regression
    const { m: slope, b: intercept } = ss.linearRegression(x, values);
    
    // Generate forecast
    const forecast: TimeSeriesDataPoint[] = [];
    const forecastValues: number[] = [];
    
    let lastTimestamp = new Date(data[data.length - 1].timestamp);
    
    for (let i = 0; i < periods; i++) {
      // Move to next interval
      const nextDate = new Date(lastTimestamp.getTime());
      if (interval === 'day') {
        nextDate.setDate(nextDate.getDate() + 1);
      } else if (interval === 'week') {
        nextDate.setDate(nextDate.getDate() + 7);
      } else { // month
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      lastTimestamp = nextDate;
      
      // Calculate forecast using linear regression
      const forecastValue = slope * (values.length + i) + intercept;
      forecastValues.push(forecastValue);
      
      forecast.push({
        timestamp: nextDate.toISOString(),
        value: Math.max(0, Math.round(forecastValue))
      });
    }
    
    // Calculate confidence intervals
    const residuals = x.map((_, i) => values[i] - (slope * x[i] + intercept));
    const stdDev = ss.standardDeviation(residuals);
    
    const upperBound = forecast.map(point => ({
      timestamp: point.timestamp,
      value: Math.round(point.value + 1.96 * stdDev)
    }));
    
    const lowerBound = forecast.map(point => ({
      timestamp: point.timestamp,
      value: Math.max(0, Math.round(point.value - 1.96 * stdDev))
    }));
    
    // Calculate error metrics
    const rmse = this.calculateRMSE(values, forecastValues);
    const mape = this.calculateMAPE(values, forecastValues);
    
    return {
      forecast,
      upperBound,
      lowerBound,
      modelName: 'Linear Regression',
      rmse,
      mape
    };
  }
  
  /**
   * Calculates difference between consecutive values in a series
   * @param {number[]} values - Array of values
   * @param {number} order - Order of differencing
   */
  difference(values: number[], order: number = 1): number[] {
    if (order <= 0 || values.length <= 1) return values;
    
    const diff = [];
    for (let i = 1; i < values.length; i++) {
      diff.push(values[i] - values[i - 1]);
    }
    
    if (order === 1) return diff;
    return this.difference(diff, order - 1);
  }
  
  /**
   * Calculate autoregressive (AR) coefficients
   * @param {number[]} values - Array of values
   * @param {number} p - AR order
   */
  calculateARCoefficients(values: number[], p: number): number[] {
    // Yule-Walker equations using matrix operations
    const n = values.length;
    
    // Calculate autocorrelations
    const r: number[] = [];
    for (let k = 0; k <= p; k++) {
      let sum = 0;
      for (let i = 0; i < n - k; i++) {
        sum += values[i] * values[i + k];
      }
      r.push(sum / (n - k));
    }
    
    // Create Toeplitz matrix
    const toeplitz = [];
    for (let i = 0; i < p; i++) {
      const row = [];
      for (let j = 0; j < p; j++) {
        row.push(r[Math.abs(i - j)]);
      }
      toeplitz.push(row);
    }
    
    // Convert to ML-Matrix format
    const R = new Matrix(toeplitz);
    const b = Matrix.columnVector(r.slice(1, p + 1));
    
    // Solve system of equations
    try {
      const phi = Matrix.solve(R, b);
      return phi.to1DArray();
    } catch (e) {
      // Fall back to simpler approach if matrix is singular
      return new Array(p).fill(0.1); // Simple default values
    }
  }
  
  /**
   * Calculate moving average (MA) coefficients
   * @param {number[]} values - Array of values
   * @param {number} q - MA order
   */
  calculateMACoefficients(values: number[], q: number): number[] {
    // This is a simplified approach as proper MA coefficient estimation requires iterative algorithms
    // For simplicity, we use a heuristic approach based on autocorrelation of residuals
    
    const n = values.length;
    const residuals: number[] = [];
    
    // Create simple AR model and calculate residuals
    const arCoeff = this.calculateARCoefficients(values, 1);
    for (let i = 1; i < n; i++) {
      const predicted = arCoeff[0] * values[i - 1];
      residuals.push(values[i] - predicted);
    }
    
    // Calculate autocorrelation of residuals
    const theta: number[] = [];
    for (let k = 1; k <= q; k++) {
      let sum = 0;
      for (let i = 0; i < residuals.length - k; i++) {
        sum += residuals[i] * residuals[i + k];
      }
      const autocorr = sum / (residuals.length - k) / ss.variance(residuals);
      theta.push(-autocorr); // MA coefficients are negative of autocorrelations
    }
    
    return theta;
  }
  
  /**
   * Calculate Root Mean Square Error
   * @param {number[]} actual - Actual values
   * @param {number[]} predicted - Predicted values
   */
  calculateRMSE(actual: number[], predicted: number[]): number {
    // For simplicity, we compare the predicted values to the last few actual values
    // This is not a true out-of-sample validation but gives some indication of accuracy
    const n = Math.min(actual.length, predicted.length);
    if (n === 0) return 0;
    
    const lastActual = actual.slice(-n);
    const firstPredicted = predicted.slice(0, n);
    
    let sumSquaredError = 0;
    for (let i = 0; i < n; i++) {
      sumSquaredError += Math.pow(lastActual[i] - firstPredicted[i], 2);
    }
    
    return Math.sqrt(sumSquaredError / n);
  }
  
  /**
   * Calculate Mean Absolute Percentage Error
   * @param {number[]} actual - Actual values
   * @param {number[]} predicted - Predicted values
   */
  calculateMAPE(actual: number[], predicted: number[]): number {
    // For simplicity, similar to RMSE calculation
    const n = Math.min(actual.length, predicted.length);
    if (n === 0) return 0;
    
    const lastActual = actual.slice(-n);
    const firstPredicted = predicted.slice(0, n);
    
    let sumAbsPercentageError = 0;
    for (let i = 0; i < n; i++) {
      if (lastActual[i] !== 0) {
        sumAbsPercentageError += Math.abs((lastActual[i] - firstPredicted[i]) / lastActual[i]);
      }
    }
    
    return (sumAbsPercentageError / n) * 100;
  }
}

export const forecastingService = new ForecastingService();
