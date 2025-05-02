#!/usr/bin/env python3

import sys
import json
import pandas as pd
from pytrends.request import TrendReq
from datetime import datetime, timedelta

# Initialize pytrends
pytrends = TrendReq(hl='en-US', tz=360)

def get_interest_over_time(keywords, period='today 12-m'):
    """Get interest over time for keywords"""
    try:
        # Make sure keywords is a list
        if isinstance(keywords, str):
            keywords = [keywords]
        
        # Need to build_payload before making a request
        pytrends.build_payload(keywords, cat=0, timeframe=period, geo='', gprop='')
        
        # Get interest over time
        interest_over_time_df = pytrends.interest_over_time()
        
        # Format the data
        if not interest_over_time_df.empty:
            # Reset index to convert date to a column
            df_reset = interest_over_time_df.reset_index()
            # Convert date to string format
            df_reset['date'] = df_reset['date'].dt.strftime('%Y-%m-%d')
            # Convert to list of records
            result_data = df_reset.to_dict('records')
            
            return {
                'status': 'success',
                'data': result_data
            }
        else:
            return {
                'status': 'error',
                'message': 'No data returned for the query'
            }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }

def get_related_queries(keyword, period='today 12-m'):
    """Get related queries for a keyword"""
    try:
        # Build payload with a single keyword
        pytrends.build_payload([keyword], cat=0, timeframe=period, geo='', gprop='')
        
        # Get related queries
        related_queries_dict = pytrends.related_queries()
        
        result = {}
        
        if keyword in related_queries_dict:
            query_data = related_queries_dict[keyword]
            
            # Process top queries if available
            if 'top' in query_data and not query_data['top'].empty:
                result['top'] = query_data['top'].to_dict('records')
            
            # Process rising queries if available
            if 'rising' in query_data and not query_data['rising'].empty:
                result['rising'] = query_data['rising'].to_dict('records')
            
            return {
                'status': 'success',
                'data': result
            }
        else:
            return {
                'status': 'error',
                'message': 'No data returned for the query'
            }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }

def get_related_topics(keyword, period='today 12-m'):
    """Get related topics for a keyword"""
    try:
        # Build payload with a single keyword
        pytrends.build_payload([keyword], cat=0, timeframe=period, geo='', gprop='')
        
        # Get related topics
        related_topics_dict = pytrends.related_topics()
        
        result = {}
        
        if keyword in related_topics_dict:
            topics_data = related_topics_dict[keyword]
            
            # Process top topics if available
            if 'top' in topics_data and not topics_data['top'].empty:
                result['top'] = topics_data['top'].to_dict('records')
            
            # Process rising topics if available
            if 'rising' in topics_data and not topics_data['rising'].empty:
                result['rising'] = topics_data['rising'].to_dict('records')
            
            return {
                'status': 'success',
                'data': result
            }
        else:
            return {
                'status': 'error',
                'message': 'No data returned for the query'
            }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }

def get_trending_searches(geo='US'):
    """Get trending searches for a region"""
    try:
        # Get trending searches
        trending_searches_df = pytrends.trending_searches(pn=geo)
        
        # Format the data
        if not trending_searches_df.empty:
            # Rename the column
            trending_searches_df.columns = ['query']
            # Add a rank column
            trending_searches_df['rank'] = trending_searches_df.index + 1
            # Convert to list of records
            result_data = trending_searches_df.to_dict('records')
            
            return {
                'status': 'success',
                'geo': geo,
                'date': datetime.now().strftime('%Y-%m-%d'),
                'data': result_data
            }
        else:
            return {
                'status': 'error',
                'message': 'No data returned for the query'
            }
    except Exception as e:
        return {
            'status': 'error',
            'message': str(e)
        }

def get_industry_interest(industry_keywords, period='today 12-m', region='US'):
    """Get interest for industry-related keywords"""
    try:
        all_data = []
        chunks = [industry_keywords[i:i+5] for i in range(0, len(industry_keywords), 5)]
        
        for chunk in chunks:
            # Build payload with keywords (max 5 per request)
            pytrends.build_payload(chunk, cat=0, timeframe=period, geo=region, gprop='')
            
            # Get interest over time
            interest_df = pytrends.interest_over_time()
            
            if not interest_df.empty:
                # Remove the isPartial column if it exists
                if 'isPartial' in interest_df.columns:
                    interest_df = interest_df.drop('isPartial', axis=1)
                
                # Reset index to make date a column
                interest_df_reset = interest_df.reset_index()
                interest_df_reset['date'] = interest_df_reset['date'].dt.strftime('%Y-%m-%d')
                
                # Melt the dataframe to get keyword as a column
                melted_df = pd.melt(
                    interest_df_reset,
                    id_vars=['date'],
                    value_vars=chunk,
                    var_name='keyword',
                    value_name='interest'
                )
                
                # Add to the result
                all_data.extend(melted_df.to_dict('records'))
        
        if all_data:
            return {
                'status': 'success',
                'region': region,
                'period': period,
                'data': all_data
            }
        else:
            return {
                'status': 'error',
                'message': 'No data returned for the query'
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
    
    if command == 'interest':
        if len(sys.argv) < 3:
            print(json.dumps({'status': 'error', 'message': 'No keywords specified'}))
            return
        keywords = sys.argv[2].split(',')  # Comma-separated keywords
        period = sys.argv[3] if len(sys.argv) > 3 else 'today 12-m'
        result = get_interest_over_time(keywords, period)
    elif command == 'related_queries':
        if len(sys.argv) < 3:
            print(json.dumps({'status': 'error', 'message': 'No keyword specified'}))
            return
        keyword = sys.argv[2]
        period = sys.argv[3] if len(sys.argv) > 3 else 'today 12-m'
        result = get_related_queries(keyword, period)
    elif command == 'related_topics':
        if len(sys.argv) < 3:
            print(json.dumps({'status': 'error', 'message': 'No keyword specified'}))
            return
        keyword = sys.argv[2]
        period = sys.argv[3] if len(sys.argv) > 3 else 'today 12-m'
        result = get_related_topics(keyword, period)
    elif command == 'trending':
        geo = sys.argv[2] if len(sys.argv) > 2 else 'US'
        result = get_trending_searches(geo)
    elif command == 'industry':
        if len(sys.argv) < 3:
            print(json.dumps({'status': 'error', 'message': 'No industry keywords specified'}))
            return
        industry_keywords = sys.argv[2].split(',')  # Comma-separated keywords
        period = sys.argv[3] if len(sys.argv) > 3 else 'today 12-m'
        region = sys.argv[4] if len(sys.argv) > 4 else 'US'
        result = get_industry_interest(industry_keywords, period, region)
    else:
        result = {'status': 'error', 'message': f'Unknown command: {command}'}
    
    print(json.dumps(result))

if __name__ == "__main__":
    main()
