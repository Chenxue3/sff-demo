#!/usr/bin/env python3
"""
Clean and simple country data processor
No bullshit, just gets the job done
"""

import json
from collections import defaultdict

def load_data():
    """Load the source data file"""
    file_path = '/Users/zoea/Projects/sff/sff-demo/word_frequency/xhs_all_content_wordcloud_frequencies_compact_labeled.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_country_mapping():
    """Country name normalization - keep it simple"""
    return {
        # Australia variants and cities
        'Australia': 'Australia', 'Australian': 'Australia', 'Australian cattle': 'Australia',
        'Australian dollar': 'Australia', 'Western Australia': 'Australia', 'Australians': 'Australia',
        'Sydney': 'Australia', 'Melbourne': 'Australia', 'Brisbane': 'Australia', 'Perth': 'Australia',
        'Adelaide': 'Australia', 'Canberra': 'Australia', 'Gold Coast': 'Australia',
        
        # Japan variants and cities
        'Japan': 'Japan', 'Japanese': 'Japan', 'Made in Japan': 'Japan',
        'Tokyo': 'Japan', 'Osaka': 'Japan', 'Kyoto': 'Japan', 'Yokohama': 'Japan',
        'Nagoya': 'Japan', 'Sapporo': 'Japan', 'Kobe': 'Japan', 'Fukuoka': 'Japan',
        
        # New Zealand variants and cities
        'New Zealand': 'New Zealand', 'New Zealand Dollar': 'New Zealand',
        'Auckland': 'New Zealand', 'Wellington': 'New Zealand', 'Christchurch': 'New Zealand',
        'Hamilton': 'New Zealand', 'Tauranga': 'New Zealand', 'Napier': 'New Zealand',
        
        # USA variants and cities
        'USA': 'United States', 'U.S.': 'United States', 'USDA': 'United States',
        'Imports from the United States': 'United States',
        'New York': 'United States', 'Los Angeles': 'United States', 'Chicago': 'United States',
        'Houston': 'United States', 'Phoenix': 'United States', 'Philadelphia': 'United States',
        'San Antonio': 'United States', 'San Diego': 'United States', 'Dallas': 'United States',
        'San Jose': 'United States', 'Austin': 'United States', 'Jacksonville': 'United States',
        'Fort Worth': 'United States', 'Columbus': 'United States', 'Charlotte': 'United States',
        'San Francisco': 'United States', 'Indianapolis': 'United States', 'Seattle': 'United States',
        'Denver': 'United States', 'Washington': 'United States', 'Boston': 'United States',
        'El Paso': 'United States', 'Nashville': 'United States', 'Detroit': 'United States',
        'Oklahoma City': 'United States', 'Portland': 'United States', 'Las Vegas': 'United States',
        'Memphis': 'United States', 'Louisville': 'United States', 'Baltimore': 'United States',
        'Milwaukee': 'United States', 'Albuquerque': 'United States', 'Tucson': 'United States',
        'Fresno': 'United States', 'Sacramento': 'United States', 'Mesa': 'United States',
        'Kansas City': 'United States', 'Atlanta': 'United States', 'Long Beach': 'United States',
        'Colorado Springs': 'United States', 'Raleigh': 'United States', 'Miami': 'United States',
        'Virginia Beach': 'United States', 'Omaha': 'United States', 'Oakland': 'United States',
        'Minneapolis': 'United States', 'Tampa': 'United States', 'Tulsa': 'United States',
        'Arlington': 'United States', 'New Orleans': 'United States', 'Wichita': 'United States',
        'Cleveland': 'United States', 'Bakersfield': 'United States', 'Aurora': 'United States',
        'Anaheim': 'United States', 'Honolulu': 'United States', 'Santa Ana': 'United States',
        'Corpus Christi': 'United States', 'Riverside': 'United States', 'Lexington': 'United States',
        'Stockton': 'United States', 'Henderson': 'United States', 'Saint Paul': 'United States',
        'St. Louis': 'United States', 'St. Petersburg': 'United States', 'Cincinnati': 'United States',
        'Pittsburgh': 'United States', 'Anchorage': 'United States', 'Greensboro': 'United States',
        'Plano': 'United States', 'Newark': 'United States', 'Durham': 'United States',
        'Lincoln': 'United States', 'Orlando': 'United States', 'Chula Vista': 'United States',
        'Jersey City': 'United States', 'Chandler': 'United States', 'Madison': 'United States',
        'Laredo': 'United States', 'Winston-Salem': 'United States', 'Lubbock': 'United States',
        'Garland': 'United States', 'Glendale': 'United States', 'Hialeah': 'United States',
        'Reno': 'United States', 'Baton Rouge': 'United States', 'Irvine': 'United States',
        'Chesapeake': 'United States', 'Irving': 'United States', 'Scottsdale': 'United States',
        'North Las Vegas': 'United States', 'Fremont': 'United States', 'Gilbert': 'United States',
        'San Bernardino': 'United States', 'Boise': 'United States', 'Birmingham': 'United States',
        
        # China variants and cities
        'China': 'China', 'domestic': 'China', 'Domestic': 'China', 'local': 'China',
        'Beijing': 'China', 'Shanghai': 'China', 'Guangzhou': 'China', 'Shenzhen': 'China',
        'Tianjin': 'China', 'Chongqing': 'China', 'Chengdu': 'China', 'Hangzhou': 'China',
        'Wuhan': 'China', 'Xi\'an': 'China', 'Nanjing': 'China', 'Zhengzhou': 'China',
        'Jinan': 'China', 'Qingdao': 'China', 'Dalian': 'China', 'Ningbo': 'China',
        'Xiamen': 'China', 'Kunming': 'China', 'Harbin': 'China', 'Changsha': 'China',
        'Fuzhou': 'China', 'Shijiazhuang': 'China', 'Jilin': 'China', 'Hefei': 'China',
        'Nanchang': 'China', 'Shantou': 'China', 'Zhongshan': 'China', 'Huizhou': 'China',
        'Zhuhai': 'China', 'Dongguan': 'China', 'Foshan': 'China', 'Suzhou': 'China',
        'Wuxi': 'China', 'Changzhou': 'China', 'Nantong': 'China', 'Yangzhou': 'China',
        'Zhenjiang': 'China', 'Taizhou': 'China', 'Shaoxing': 'China', 'Jinhua': 'China',
        'Quzhou': 'China', 'Zhoushan': 'China', 'Lishui': 'China', 'Huzhou': 'China',
        'Jiaxing': 'China', 'Hangzhou': 'China', 'Ningbo': 'China', 'Wenzhou': 'China',
        'Lishui': 'China', 'Jinhua': 'China', 'Quzhou': 'China', 'Zhoushan': 'China',
        
        # Other countries and their major cities
        'Singapore': 'Singapore',
        'Brazil': 'Brazil', 'Sao Paulo': 'Brazil', 'Rio de Janeiro': 'Brazil', 'Brasilia': 'Brazil',
        'Argentina': 'Argentina', 'Buenos Aires': 'Argentina', 'Cordoba': 'Argentina',
        'South Korea': 'South Korea', 'Seoul': 'South Korea', 'Busan': 'South Korea', 'Incheon': 'South Korea',
        'U.K.': 'United Kingdom', 'London': 'United Kingdom', 'Manchester': 'United Kingdom', 'Birmingham': 'United Kingdom',
        'Spain': 'Spain', 'Madrid': 'Spain', 'Barcelona': 'Spain', 'Valencia': 'Spain',
        'Malaysia': 'Malaysia', 'Kuala Lumpur': 'Malaysia', 'George Town': 'Malaysia', 'Ipoh': 'Malaysia',
        'Chile': 'Chile', 'Santiago': 'Chile', 'Valparaiso': 'Chile', 'Concepcion': 'Chile',
        'Hongkong': 'Hong Kong', 'Hong Kong': 'Hong Kong',
        'Switzerland': 'Switzerland', 'Zurich': 'Switzerland', 'Geneva': 'Switzerland', 'Bern': 'Switzerland',
        'Russia': 'Russia', 'Moscow': 'Russia', 'Saint Petersburg': 'Russia', 'Novosibirsk': 'Russia',
    }

def process_country_frequencies(data, mapping):
    """Extract and aggregate country frequencies with original words"""
    frequencies = defaultdict(int)
    country_words = defaultdict(list)
    
    for item in data:
        # Check for both origin_country and city_region labels
        labels = item.get('labels', [])
        if 'origin_country' not in labels and 'city_region' not in labels:
            continue
            
        en_name = item.get('en', '')
        zh_name = item.get('zh', '')
        frequency = item.get('frequency', 0)
        
        country = mapping.get(en_name)
        if country:
            frequencies[country] += frequency
            country_words[country].append({
                'zh': zh_name,
                'en': en_name,
                'frequency': frequency
            })
    
    return dict(frequencies), dict(country_words)

def create_output(frequencies, country_words):
    """Create final output structure"""
    total = sum(frequencies.values())
    sorted_items = sorted(frequencies.items(), key=lambda x: x[1], reverse=True)
    
    return {
        'countries': [
            {
                'name': country,
                'frequency': freq,
                'percentage': round((freq / total) * 100, 2) if total > 0 else 0,
                'words': sorted(country_words.get(country, []), key=lambda x: x['frequency'], reverse=True)
            }
            for country, freq in sorted_items
        ],
        'total_mentions': total,
        'unique_countries': len(sorted_items)
    }

def main():
    """Main execution - keep it simple"""
    data = load_data()
    mapping = get_country_mapping()
    frequencies, country_words = process_country_frequencies(data, mapping)
    result = create_output(frequencies, country_words)
    
    # Write output
    output_path = '/Users/zoea/Projects/sff/sff-demo/public/data/country_analysis.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    # Simple output
    print(f"Processed {result['unique_countries']} countries, {result['total_mentions']} total mentions")
    for country in result['countries'][:5]:
        print(f"  {country['name']}: {country['frequency']} ({country['percentage']}%)")

if __name__ == '__main__':
    main()