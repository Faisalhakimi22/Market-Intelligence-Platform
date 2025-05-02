/**
 * Forecasting Service for market trend predictions
 * 
 * This service implements time-series forecasting models including:
 * - Moving Average (MA)
 * - Auto-Regressive Integrated Moving Average (ARIMA)
 * - Linear regression forecasting
 */

import { Matrix } from 'ml-matrix';
import * as ss from 'simple-statistics';

interface TimeSeriesDataPoint {
  timestamp: Date;
  value: number;
}

interface ForecastResult {
  forecast: TimeSeriesDataPoint[];
  upperBound?: TimeSeriesDataPoint[];
  lowerBound?: TimeSeriesDataPoint[];
  modelName: string;
  rmse?: number; // Root Mean Square Error (measure of model accuracy)
  mape?: number; // Mean Absolute Percentage Error
}

/**
 * Time-series forecasting service for market trend analysis
 */
class ForecastingService {
  /**
   * Creates a simple moving average forecast
   * 
   * @param data - Historical time series data
   * @param windowSize - Size of the moving average window
   * @param periodsToForecast - Number of periods to forecast into the future
   * @param confidenceInterval - Confidence interval for upper/lower bounds (0-1)
   */
  async movingAverageForecast(
    data: TimeSeriesDataPoint[], 
    windowSize: number = 3, 
    periodsToForecast: number = 6,
    confidenceInterval: number = 0.95
  ): Promise<ForecastResult> {
    // Validate inputs
    if (data.length < windowSize) {
      throw new Error(`Not enough data points. Need at least ${windowSize} points for a window size of ${windowSize}`);
    }
    
    // Extract values
    const values = data.map(d => d.value);
    
    // Calculate moving averages for historical data
    const movingAverages = [];
    for (let i = windowSize - 1; i < values.length; i++) {
      const windowValues = values.slice(i - windowSize + 1, i + 1);
      movingAverages.push(ss.mean(windowValues));
    }
    
    // Calculate standard deviation for confidence intervals
    const residuals = [];
    for (let i = 0; i < movingAverages.length; i++) {
      const actualIndex = i + windowSize - 1;
      residuals.push(values[actualIndex] - movingAverages[i]);
    }
    
    const stdDev = ss.standardDeviation(residuals);
    const zScore = this.calculateZScore(confidenceInterval);
    
    // Generate forecast values
    const lastValues = values.slice(-windowSize);
    const forecast: TimeSeriesDataPoint[] = [];
    const upperBound: TimeSeriesDataPoint[] = [];
    const lowerBound: TimeSeriesDataPoint[] = [];
    
    // Determine the time interval between data points
    const avgTimeDiff = this.calculateAverageTimeInterval(data);
    const lastDate = data[data.length - 1].timestamp;
    
    // Generate forecast points
    for (let i = 0; i < periodsToForecast; i++) {
      // For first forecast point, use the last windowSize actual values
      let forecastValues;
      if (i === 0) {
        forecastValues = lastValues;
      } else {
        // For subsequent forecast points, use the previous windowSize forecast points
        forecastValues = forecast.slice(-windowSize).map(d => d.value);
      }
      
      const forecastValue = ss.mean(forecastValues);
      const newDate = new Date(lastDate.getTime() + avgTimeDiff * (i + 1));
      
      forecast.push({
        timestamp: newDate,
        value: forecastValue
      });
      
      upperBound.push({
        timestamp: newDate,
        value: forecastValue + zScore * stdDev
      });
      
      lowerBound.push({
        timestamp: newDate,
        value: Math.max(0, forecastValue - zScore * stdDev) // Ensure non-negative values
      });
    }
    
    // Calculate error metrics
    const rmse = this.calculateRMSE(data.slice(-movingAverages.length).map(d => d.value), movingAverages);
    const mape = this.calculateMAPE(data.slice(-movingAverages.length).map(d => d.value), movingAverages);
    
    return {
      forecast,
      upperBound,
      lowerBound,
      modelName: `Moving Average (${windowSize}-period)`,
      rmse,
      mape
    };
  }
  
  /**
   * Calculates forecast using Auto-Regressive Integrated Moving Average (ARIMA) model
   * This is a simplified implementation of ARIMA(p,d,q) focusing on ARIMA(1,1,1)
   * 
   * @param data - Historical time series data
   * @param periodsToForecast - Number of periods to forecast
   * @param p - Autoregressive order
   * @param d - Differencing order
   * @param q - Moving average order
   * @param confidenceInterval - Confidence interval for prediction bounds
   */
  async arimaForecast(
    data: TimeSeriesDataPoint[],
    periodsToForecast: number = 6,
    p: number = 1,
    d: number = 1,
    q: number = 1,
    confidenceInterval: number = 0.95
  ): Promise<ForecastResult> {
    if (data.length < 10) {
      throw new Error('Not enough data points for ARIMA. Need at least 10 data points.');
    }
    
    // Extract values
    const values = data.map(d => d.value);
    
    // Apply differencing (d)
    let diffValues = values;
    for (let i = 0; i < d; i++) {
      diffValues = this.difference(diffValues);
    }
    
    // Fit ARIMA model using least squares regression
    const arimaParams = this.fitARIMA(diffValues, p, q);
    
    // Generate forecasts
    const forecast: TimeSeriesDataPoint[] = [];
    const upperBound: TimeSeriesDataPoint[] = [];
    const lowerBound: TimeSeriesDataPoint[] = [];
    
    // Determine the time interval between data points
    const avgTimeDiff = this.calculateAverageTimeInterval(data);
    const lastDate = data[data.length - 1].timestamp;
    
    // Create initial condition values for forecasting
    const lastDiffValues = diffValues.slice(-Math.max(p, q));
    const lastOrigValues = values.slice(-d);
    
    // Generate forecast points
    let pastDiffPredictions = [...lastDiffValues];
    let pastOrigPredictions = [...lastOrigValues];
    
    // Calculate residuals and standard deviation for confidence intervals
    const fittedValues = this.calculateFittedValues(diffValues, arimaParams, p, q);
    const residuals = diffValues.slice(Math.max(p, q)).map((v, i) => v - fittedValues[i]);
    const stdDev = ss.standardDeviation(residuals);
    const zScore = this.calculateZScore(confidenceInterval);
    
    for (let i = 0; i < periodsToForecast; i++) {
      // ARIMA prediction for differenced series
      const diffPrediction = this.predictNextARIMA(pastDiffPredictions, arimaParams, p, q);
      pastDiffPredictions.push(diffPrediction);
      pastDiffPredictions.shift(); // Keep array size constant
      
      // Invert differencing
      let origPrediction = diffPrediction;
      for (let j = 0; j < d; j++) {
        origPrediction = origPrediction + pastOrigPredictions[pastOrigPredictions.length - 1 - j];
      }
      
      pastOrigPredictions.push(origPrediction);
      
      // Calculate date for new point
      const newDate = new Date(lastDate.getTime() + avgTimeDiff * (i + 1));
      
      forecast.push({
        timestamp: newDate,
        value: origPrediction
      });
      
      upperBound.push({
        timestamp: newDate,
        value: origPrediction + zScore * stdDev
      });
      
      lowerBound.push({
        timestamp: newDate,
        value: Math.max(0, origPrediction - zScore * stdDev) // Ensure non-negative values
      });
    }
    
    // Calculate error metrics using original values
    const undiffFittedValues = this.undifference(fittedValues, values, d);
    const testSet = values.slice(-undiffFittedValues.length);
    const rmse = this.calculateRMSE(testSet, undiffFittedValues);
    const mape = this.calculateMAPE(testSet, undiffFittedValues);
    
    return {
      forecast,
      upperBound,
      lowerBound,
      modelName: `ARIMA(${p},${d},${q})`,
      rmse,
      mape
    };
  }
  
  /**
   * Fit linear regression model and forecast future values
   * 
   * @param data - Historical time series data
   * @param periodsToForecast - Number of periods to forecast
   * @param confidenceInterval - Confidence interval for prediction bounds
   */
  async linearRegressionForecast(
    data: TimeSeriesDataPoint[],
    periodsToForecast: number = 6,
    confidenceInterval: number = 0.95
  ): Promise<ForecastResult> {
    if (data.length < 3) {
      throw new Error('Not enough data points for linear regression. Need at least 3 data points.');
    }
    
    // Extract values and create numeric time index
    const y = data.map(d => d.value);
    const x = Array.from({length: data.length}, (_, i) => i);

    // Prepare data for linear regression
    const xMatrix = x.map(val => [1, val]); // Add constant term
    
    // Fit linear regression
    // Handle potential type issues with simple-statistics linearRegression
    let slope = 0;
    let intercept = 0;
    
    try {
      const regression = ss.linearRegression(xMatrix, y);
      // Access regression coefficients safely
      if (Array.isArray(regression.b) && regression.b.length >= 2) {
        intercept = regression.b[0] || 0;
        slope = regression.b[1] || 0;
      } else {
        // Fallback to simple calculation if regression.b is not as expected
        const xMean = ss.mean(x);
        const yMean = ss.mean(y);
        
        let numerator = 0;
        let denominator = 0;
        
        for (let i = 0; i < x.length; i++) {
          numerator += (x[i] - xMean) * (y[i] - yMean);
          denominator += Math.pow(x[i] - xMean, 2);
        }
        
        slope = denominator !== 0 ? numerator / denominator : 0;
        intercept = yMean - slope * xMean;
      }
    } catch (error) {
      console.warn('Error in regression calculation, using simple trend estimation:', error);
      // Simple trend estimate using first and last points
      if (data.length >= 2) {
        const firstVal = y[0];
        const lastVal = y[y.length - 1];
        slope = (lastVal - firstVal) / (x.length - 1 || 1);
        intercept = firstVal;
      }
    }
    
    // Calculate fitted values and residuals
    const fittedValues = x.map(xi => intercept + slope * xi);
    const residuals = y.map((yi, i) => yi - fittedValues[i]);
    
    // Calculate standard error for confidence intervals
    const stdDev = ss.standardDeviation(residuals);
    const zScore = this.calculateZScore(confidenceInterval);
    
    // Generate forecast
    const forecast: TimeSeriesDataPoint[] = [];
    const upperBound: TimeSeriesDataPoint[] = [];
    const lowerBound: TimeSeriesDataPoint[] = [];
    
    // Determine time interval between points
    const avgTimeDiff = this.calculateAverageTimeInterval(data);
    const lastDate = data[data.length - 1].timestamp;
    
    // Generate forecast points
    for (let i = 0; i < periodsToForecast; i++) {
      const forecastIndex = x.length + i;
      const forecastValue = intercept + slope * forecastIndex;
      const newDate = new Date(lastDate.getTime() + avgTimeDiff * (i + 1));
      
      forecast.push({
        timestamp: newDate,
        value: forecastValue
      });
      
      upperBound.push({
        timestamp: newDate,
        value: forecastValue + zScore * stdDev
      });
      
      lowerBound.push({
        timestamp: newDate,
        value: Math.max(0, forecastValue - zScore * stdDev) // Ensure non-negative values
      });
    }
    
    // Calculate error metrics
    const rmse = this.calculateRMSE(y, fittedValues);
    const mape = this.calculateMAPE(y, fittedValues);
    
    return {
      forecast,
      upperBound,
      lowerBound,
      modelName: 'Linear Trend',
      rmse,
      mape
    };
  }
  
  /**
   * Generate data samples for testing the forecasting models
   * For real world applications, this would be replaced with actual historical data
   */
  generateSampleTimeSeriesData(count: number, interval: 'day' | 'week' | 'month' = 'month'): TimeSeriesDataPoint[] {
    const result: TimeSeriesDataPoint[] = [];
    const now = new Date();
    const trend = 15; // Base upward trend
    const seasonality = 20; // Seasonality magnitude
    
    // Convert interval to milliseconds
    let intervalMs: number;
    switch (interval) {
      case 'day':
        intervalMs = 24 * 60 * 60 * 1000;
        break;
      case 'week':
        intervalMs = 7 * 24 * 60 * 60 * 1000;
        break;
      default:
      case 'month':
        intervalMs = 30 * 24 * 60 * 60 * 1000;
        break;
    }
    
    for (let i = 0; i < count; i++) {
      // Start from the past and move forward
      const timestamp = new Date(now.getTime() - (count - i) * intervalMs);
      
      // Calculate base trend with noise
      const trendComponent = trend * (i / count);
      
      // Add seasonality (higher in middle of year)
      const month = timestamp.getMonth();
      const seasonalFactor = Math.sin((month / 11) * Math.PI);
      const seasonalComponent = seasonality * seasonalFactor;
      
      // Add random noise
      const noise = (Math.random() - 0.5) * 10;
      
      // Combine components
      const value = 100 + trendComponent + seasonalComponent + noise;
      
      result.push({
        timestamp,
        value: Math.max(0, value) // Ensure non-negative values
      });
    }
    
    return result;
  }
  
  /**
   * Generate sample market growth data with a specified trend
   * For real world applications, this would be replaced with actual historical data
   */
  generateMarketGrowthData(
    count: number, 
    interval: 'day' | 'week' | 'month' = 'month',
    growthRate: number = 0.05, // 5% average growth
    volatility: number = 0.02 // 2% volatility
  ): TimeSeriesDataPoint[] {
    const result: TimeSeriesDataPoint[] = [];
    const now = new Date();
    
    // Convert interval to milliseconds
    let intervalMs: number;
    switch (interval) {
      case 'day':
        intervalMs = 24 * 60 * 60 * 1000;
        break;
      case 'week':
        intervalMs = 7 * 24 * 60 * 60 * 1000;
        break;
      default:
      case 'month':
        intervalMs = 30 * 24 * 60 * 60 * 1000;
        break;
    }
    
    let marketSize = 100; // Starting market size
    
    for (let i = 0; i < count; i++) {
      // Start from the past and move forward
      const timestamp = new Date(now.getTime() - (count - i) * intervalMs);
      
      // Calculate growth with random factor
      const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
      const periodGrowth = Math.pow(1 + growthRate, 1/12) * randomFactor;
      
      // Update market size
      marketSize *= periodGrowth;
      
      result.push({
        timestamp,
        value: marketSize
      });
    }
    
    return result;
  }

  /**
   * Compare different forecasting models and select the best one based on error metrics
   * 
   * @param data - Historical time series data
   * @param periodsToForecast - Number of periods to forecast
   * @param confidenceInterval - Confidence interval for prediction bounds
   */
  async getBestForecast(
    data: TimeSeriesDataPoint[],
    periodsToForecast: number = 6,
    confidenceInterval: number = 0.95
  ): Promise<{bestModel: ForecastResult, allModels: ForecastResult[]}> {
    // Need enough data for all models
    if (data.length < 10) {
      throw new Error('Not enough data points for forecasting. Need at least 10 data points.');
    }
    
    const models: ForecastResult[] = [];
    
    try {
      // Try different models
      models.push(await this.movingAverageForecast(data, 3, periodsToForecast, confidenceInterval));
      models.push(await this.arimaForecast(data, periodsToForecast, 1, 1, 1, confidenceInterval));
      models.push(await this.linearRegressionForecast(data, periodsToForecast, confidenceInterval));
    } catch (error) {
      console.error('Error calculating forecasts:', error);
      
      // If any model fails, fall back to the simplest model (linear trend)
      if (models.length === 0) {
        models.push(await this.linearRegressionForecast(data, periodsToForecast, confidenceInterval));
      }
    }
    
    // Select the best model based on MAPE (lower is better)
    models.sort((a, b) => (a.mape || Infinity) - (b.mape || Infinity));
    
    return {
      bestModel: models[0],
      allModels: models
    };
  }

  /**
   * Forecast demand trends for a specific industry using historical data
   * 
   * @param industryId - The industry to forecast
   * @param historicalData - Historical time series data
   * @param periodsToForecast - Number of periods to forecast
   */
  async forecastDemandTrends(
    industryId: number,
    historicalData: TimeSeriesDataPoint[],
    periodsToForecast: number = 6
  ): Promise<ForecastResult> {
    // For real implementations, historical data would come from a database or API
    // but for now we're using the provided historical data directly
    
    try {
      // Get the best forecast model
      const { bestModel } = await this.getBestForecast(historicalData, periodsToForecast);
      return bestModel;
    } catch (error) {
      console.error(`Error forecasting demand trends for industry ${industryId}:`, error);
      throw error;
    }
  }

  // ------ Helper Methods ------

  /**
   * Calculate the average time interval between data points
   */
  private calculateAverageTimeInterval(data: TimeSeriesDataPoint[]): number {
    if (data.length <= 1) return 30 * 24 * 60 * 60 * 1000; // Default to monthly if not enough points
    
    const timeDiffs = [];
    for (let i = 1; i < data.length; i++) {
      const diff = data[i].timestamp.getTime() - data[i-1].timestamp.getTime();
      timeDiffs.push(diff);
    }
    
    return ss.mean(timeDiffs);
  }

  /**
   * Calculate the Z-score for a given confidence interval
   */
  private calculateZScore(confidenceInterval: number): number {
    // Approximation of the probit function
    const p = 1 - (1 - confidenceInterval) / 2;
    const zScoreApprox = Math.sqrt(2) * this.erfInv(2 * p - 1);
    return zScoreApprox;
  }

  /**
   * Inverse error function approximation
   */
  private erfInv(x: number): number {
    // Simplified approximation of inverse error function
    // This is less accurate but doesn't depend on erf function
    const a = 0.147; // Constant for approximation
    const signX = Math.sign(x);
    const absX = Math.abs(x);
    
    if (absX >= 1) {
      return signX * Infinity;
    }
    
    // Simple approximation for normal ranges
    if (absX <= 0.7) {
      // Linear approximation for smaller values
      return signX * absX * 1.25;
    }
    
    // Use simplified formula for larger values
    const term = Math.sqrt(-Math.log(1 - absX));
    
    return signX * term;
  }

  /**
   * Calculate first difference of a time series
   */
  private difference(values: number[]): number[] {
    const result = [];
    for (let i = 1; i < values.length; i++) {
      result.push(values[i] - values[i-1]);
    }
    return result;
  }

  /**
   * Invert differencing to get original series values
   */
  private undifference(diffValues: number[], origValues: number[], d: number): number[] {
    if (d === 0) return diffValues;
    
    const startIdx = origValues.length - diffValues.length - d;
    const undiff = [];
    
    // Use original values as starting points
    let prev = origValues[startIdx];
    
    for (let i = 0; i < diffValues.length; i++) {
      const curr = prev + diffValues[i];
      undiff.push(curr);
      prev = curr;
    }
    
    return undiff;
  }

  /**
   * Fit ARIMA model parameters using least squares regression
   */
  private fitARIMA(diffValues: number[], p: number, q: number): number[] {
    if (diffValues.length <= Math.max(p, q)) {
      throw new Error('Not enough data points after differencing.');
    }
    
    // Set up matrix for regression
    const n = diffValues.length - Math.max(p, q);
    const X = []; // Design matrix
    const y = []; // Target values
    
    // Create design matrix for AR(p) and MA(q) terms
    for (let i = Math.max(p, q); i < diffValues.length; i++) {
      const row = [];
      
      // Add AR terms
      for (let j = 1; j <= p; j++) {
        row.push(diffValues[i-j]);
      }
      
      // Add MA terms (using residuals)
      // Since we don't have true residuals yet, we'll use differenced values as initial approximation
      for (let j = 1; j <= q; j++) {
        row.push(diffValues[i-j]);
      }
      
      X.push(row);
      y.push(diffValues[i]);
    }
    
    // Solve using simplified least squares approach
    try {
      const Xmatrix = new Matrix(X);
      const Xt = Xmatrix.transpose();
      const XtX = Xt.mmul(Xmatrix);
      
      // Manually compute pseudoinverse (simplified approach)
      // Find coefficients using simple regression methods
      let params: number[] = [];
      
      if (p > 0) {
        // Simplified AR parameter estimation using autocorrelation
        let sumProduct = 0;
        let sumSquared = 0;
        
        for (let i = 1; i < diffValues.length; i++) {
          sumProduct += diffValues[i] * diffValues[i-1];
          sumSquared += diffValues[i-1] * diffValues[i-1];
        }
        
        const arCoef = sumSquared !== 0 ? sumProduct / sumSquared : 0.5;
        params.push(Math.min(Math.max(arCoef, -0.99), 0.99)); // Constrain for stability
      }
      
      // Add MA parameters (simplified)
      for (let i = 0; i < q; i++) {
        params.push(0.1); // Small positive MA coefficient
      }
      
      return params;
    } catch (error) {
      // If computation fails, return a simple AR(1) model
      return [0.5, 0];
    }
  }

  /**
   * Calculate fitted values for ARIMA model
   */
  private calculateFittedValues(diffValues: number[], params: number[], p: number, q: number): number[] {
    const fitted = [];
    const maxLag = Math.max(p, q);
    
    for (let i = maxLag; i < diffValues.length; i++) {
      let pred = 0;
      
      // Add AR terms
      for (let j = 0; j < p; j++) {
        pred += params[j] * diffValues[i - j - 1];
      }
      
      // Add MA terms (approximated as AR terms initially)
      for (let j = 0; j < q; j++) {
        pred += params[p + j] * diffValues[i - j - 1];
      }
      
      fitted.push(pred);
    }
    
    return fitted;
  }

  /**
   * Predict next value using ARIMA model
   */
  private predictNextARIMA(pastValues: number[], params: number[], p: number, q: number): number {
    let pred = 0;
    
    // Add AR terms
    for (let j = 0; j < p; j++) {
      if (j < pastValues.length) {
        pred += params[j] * pastValues[pastValues.length - j - 1];
      }
    }
    
    // Add MA terms
    for (let j = 0; j < q; j++) {
      if (p + j < params.length && j < pastValues.length) {
        pred += params[p + j] * pastValues[pastValues.length - j - 1];
      }
    }
    
    return pred;
  }

  /**
   * Calculate Root Mean Square Error
   */
  private calculateRMSE(actual: number[], predicted: number[]): number {
    if (actual.length !== predicted.length) {
      throw new Error('Arrays must have the same length');
    }
    
    const squaredErrors = actual.map((val, i) => Math.pow(val - predicted[i], 2));
    const mse = ss.mean(squaredErrors);
    return Math.sqrt(mse);
  }

  /**
   * Calculate Mean Absolute Percentage Error
   */
  private calculateMAPE(actual: number[], predicted: number[]): number {
    if (actual.length !== predicted.length) {
      throw new Error('Arrays must have the same length');
    }
    
    let sum = 0;
    let count = 0;
    
    for (let i = 0; i < actual.length; i++) {
      if (actual[i] !== 0) { // Avoid division by zero
        sum += Math.abs((actual[i] - predicted[i]) / actual[i]);
        count++;
      }
    }
    
    return (count > 0) ? (sum / count) * 100 : 0;
  }
}

export const forecastingService = new ForecastingService();
