#!/usr/bin/env python3

import sys
import json
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

def get_stock_data(symbol, period="1mo"):
    """Get stock data for a specific symbol"""
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period=period)
        
        # Convert DataFrame to list of dictionaries
        hist_reset = hist.reset_index()
        # Convert date columns to string format
        hist_reset['Date'] = hist_reset['Date'].dt.strftime('%Y-%m-%d')
        history_data = hist_reset.to_dict('records')
        
        # Get additional info
        info = stock.info
        # Keep only necessary fields to reduce data size
        filtered_info = {k: info[k] for k in [
            'shortName', 'longName', 'sector', 'industry', 'website',
            'market', 'marketCap', 'currency', 'previousClose', 'open',
            'fiftyTwoWeekHigh', 'fiftyTwoWeekLow', 'volume',
            'averageVolume', 'beta', 'trailingPE', 'forwardPE'
        ] if k in info}
        
        # Add last earnings date if available
        if 'lastDividendDate' in info and info['lastDividendDate'] is not None:
            filtered_info['lastDividendDate'] = datetime.fromtimestamp(info['lastDividendDate']).strftime('%Y-%m-%d')
        
        return {
            'status': 'success',
            'info': filtered_info,
            'history': history_data
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }

def get_market_summary():
    """Get market summary information including major indices"""
    try:
        # List of major market indices
        indices = ['^GSPC', '^DJI', '^IXIC', '^FTSE', '^GDAXI', '^FCHI', '^N225']
        results = {}
        
        for idx in indices:
            index = yf.Ticker(idx)
            hist = index.history(period="5d")
            current = hist.iloc[-1]
            previous = hist.iloc[-2] if len(hist) > 1 else current
            
            # Calculate percent change
            change_pct = ((current['Close'] - previous['Close']) / previous['Close']) * 100
            
            index_info = index.info
            index_name = index_info.get('shortName', idx)
            
            results[idx] = {
                'name': index_name,
                'price': round(current['Close'], 2),
                'change': round(current['Close'] - previous['Close'], 2),
                'change_percent': round(change_pct, 2),
                'volume': current['Volume']
            }
        
        return {
            'status': 'success',
            'data': results
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }

def get_industry_performance():
    """Get performance by industry sector"""
    try:
        # List of ETFs that track different sectors
        sector_etfs = {
            'Technology': 'XLK', 
            'Healthcare': 'XLV',
            'Financials': 'XLF',
            'Energy': 'XLE',
            'Consumer Cyclicals': 'XLY',
            'Consumer Staples': 'XLP',
            'Industrials': 'XLI',
            'Materials': 'XLB',
            'Utilities': 'XLU',
            'Real Estate': 'XLRE',
            'Communication Services': 'XLC'
        }
        
        results = []
        current_date = datetime.now().strftime('%Y-%m-%d')
        
        for sector_name, etf in sector_etfs.items():
            ticker = yf.Ticker(etf)
            hist = ticker.history(period="1mo")
            
            if len(hist) > 0:
                current = hist.iloc[-1]
                past_day = hist.iloc[-2] if len(hist) > 1 else current
                past_week = hist.iloc[-5] if len(hist) > 5 else current
                past_month = hist.iloc[0] if len(hist) > 20 else current
                
                day_change = ((current['Close'] - past_day['Close']) / past_day['Close']) * 100
                week_change = ((current['Close'] - past_week['Close']) / past_week['Close']) * 100
                month_change = ((current['Close'] - past_month['Close']) / past_month['Close']) * 100
                
                results.append({
                    'sector': sector_name,
                    'day_change': round(day_change, 2),
                    'week_change': round(week_change, 2),
                    'month_change': round(month_change, 2),
                    'last_updated': current_date
                })
        
        return {
            'status': 'success',
            'date': current_date,
            'data': results
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }

def search_stocks(query, limit=10):
    """Search for stocks based on query"""
    try:
        tickers = yf.Tickers(query)
        results = []
        
        # This approach has limitations because yfinance doesn't have a search function
        # An alternative would be to use a pre-populated list of tickers and filter
        for ticker_symbol in query.split():
            try:
                ticker = yf.Ticker(ticker_symbol)
                info = ticker.info
                if 'shortName' in info:
                    results.append({
                        'symbol': ticker_symbol,
                        'name': info.get('shortName', ''),
                        'exchange': info.get('exchange', ''),
                        'sector': info.get('sector', ''),
                        'industry': info.get('industry', '')
                    })
                    if len(results) >= limit:
                        break
            except:
                continue
        
        return {
            'status': 'success',
            'data': results
        }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }

def main():
    if len(sys.argv) < 2:
        print(json.dumps({'status': 'error', 'message': 'No command specified'}))
        return
    
    command = sys.argv[1]
    
    if command == 'stock':
        if len(sys.argv) < 3:
            print(json.dumps({'status': 'error', 'message': 'No symbol specified'}))
            return
        symbol = sys.argv[2]
        period = sys.argv[3] if len(sys.argv) > 3 else "1mo"
        result = get_stock_data(symbol, period)
    elif command == 'market':
        result = get_market_summary()
    elif command == 'sectors':
        result = get_industry_performance()
    elif command == 'search':
        if len(sys.argv) < 3:
            print(json.dumps({'status': 'error', 'message': 'No query specified'}))
            return
        query = sys.argv[2]
        limit = int(sys.argv[3]) if len(sys.argv) > 3 else 10
        result = search_stocks(query, limit)
    else:
        result = {'status': 'error', 'message': f'Unknown command: {command}'}
    
    print(json.dumps(result))

if __name__ == "__main__":
    main()
