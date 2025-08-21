#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Detailed labeling for words with frequency >= 10
"""

import json
import re
from typing import List, Dict

def get_detailed_labels(word: str, english: str) -> List[str]:
    """
    Get detailed labels for a word with comprehensive categorization
    """
    labels = []
    word_lower = word.lower()
    english_lower = english.lower()
    
    # Meat and food products
    if any(meat in word_lower for meat in ['牛肉', 'beef']):
        labels.extend(['meat_product', 'beef_category'])
    elif any(meat in word_lower for meat in ['猪肉', 'pork']):
        labels.extend(['meat_product', 'pork_category'])
    elif any(meat in word_lower for meat in ['羊肉', 'lamb', 'mutton']):
        labels.extend(['meat_product', 'lamb_category'])
    elif any(meat in word_lower for meat in ['鸡肉', 'chicken']):
        labels.extend(['meat_product', 'poultry_category'])
    elif any(meat in word_lower for meat in ['牛排', 'steak']):
        labels.extend(['meat_product', 'beef_category', 'premium_cut'])
    elif any(meat in word_lower for meat in ['五花肉', 'belly']):
        labels.extend(['meat_product', 'pork_category', 'fatty_cut'])
    
    # Food quality and taste
    if any(quality in word_lower for quality in ['好吃', 'tasty', 'delicious']):
        labels.extend(['food_quality', 'taste_positive'])
    elif any(quality in word_lower for quality in ['美食', 'gourmet']):
        labels.extend(['food_quality', 'premium_food'])
    elif any(quality in word_lower for quality in ['口感', 'taste', 'texture']):
        labels.extend(['food_quality', 'sensory_experience'])
    elif any(quality in word_lower for quality in ['新鲜', 'fresh']):
        labels.extend(['food_quality', 'freshness'])
    elif any(quality in word_lower for quality in ['品质', 'quality']):
        labels.extend(['food_quality', 'quality_standard'])
    
    # Countries and regions
    if any(country in word_lower for country in ['澳洲', 'australia']):
        labels.extend(['country_origin', 'oceanic_region', 'popular_origin'])
    elif any(country in word_lower for country in ['新西兰', 'new zealand']):
        labels.extend(['country_origin', 'oceanic_region'])
    elif any(country in word_lower for country in ['日本', 'japan']):
        labels.extend(['country_origin', 'asian_region', 'premium_origin'])
    elif any(country in word_lower for country in ['美国', 'usa', 'america']):
        labels.extend(['country_origin', 'american_region'])
    elif any(country in word_lower for country in ['中国', 'china']):
        labels.extend(['country_origin', 'asian_region', 'domestic'])
    elif any(country in word_lower for country in ['新加坡', 'singapore']):
        labels.extend(['country_origin', 'asian_region'])
    elif any(country in word_lower for country in ['巴西', 'brazil']):
        labels.extend(['country_origin', 'south_american_region'])
    elif any(country in word_lower for country in ['阿根廷', 'argentina']):
        labels.extend(['country_origin', 'south_american_region'])
    
    # Cities
    if any(city in word_lower for city in ['奥克兰', 'auckland']):
        labels.extend(['city_location', 'new_zealand_city'])
    elif any(city in word_lower for city in ['悉尼', 'sydney']):
        labels.extend(['city_location', 'australian_city'])
    
    # Retail and shopping
    if any(shop in word_lower for shop in ['超市', 'supermarket']):
        labels.extend(['retail_location', 'grocery_store'])
    elif any(shop in word_lower for shop in ['肉店', 'butcher']):
        labels.extend(['retail_location', 'specialty_store'])
    elif any(shop in word_lower for shop in ['烤肉店', 'barbecue restaurant']):
        labels.extend(['retail_location', 'restaurant'])
    
    # Brands
    if any(brand in word_lower for brand in ['a5', 'a5']):
        labels.extend(['brand', 'premium_grade', 'japanese_brand'])
    elif any(brand in word_lower for brand in ['安格斯', 'angus']):
        labels.extend(['brand', 'cattle_breed', 'premium_brand'])
    elif any(brand in word_lower for brand in ['coles', 'coles']):
        labels.extend(['brand', 'australian_retailer', 'supermarket_chain'])
    
    # Import and trade
    if any(trade in word_lower for trade in ['进口', 'import']):
        labels.extend(['import_trade', 'trade_process'])
    elif any(trade in word_lower for trade in ['海关', 'customs']):
        labels.extend(['import_trade', 'regulatory_process'])
    elif any(trade in word_lower for trade in ['报关', 'customs clearance']):
        labels.extend(['import_trade', 'documentation_process'])
    elif any(trade in word_lower for trade in ['清关', 'customs clearance']):
        labels.extend(['import_trade', 'clearance_process'])
    elif any(trade in word_lower for trade in ['进口商', 'importer']):
        labels.extend(['import_trade', 'business_entity'])
    
    # Price and value
    if any(price in word_lower for price in ['价格', 'price']):
        labels.extend(['price_value', 'cost_consideration'])
    elif any(price in word_lower for price in ['便宜', 'cheap']):
        labels.extend(['price_value', 'affordability'])
    elif any(price in word_lower for price in ['小贵', 'expensive']):
        labels.extend(['price_value', 'premium_pricing'])
    
    # Meat cuts and parts
    if any(cut in word_lower for cut in ['部位', 'part']):
        labels.extend(['meat_cuts', 'cut_classification'])
    elif any(cut in word_lower for cut in ['肋条', 'rib']):
        labels.extend(['meat_cuts', 'rib_cut'])
    elif any(cut in word_lower for cut in ['牛腩', 'brisket']):
        labels.extend(['meat_cuts', 'brisket_cut'])
    
    # Cooking methods
    if any(cooking in word_lower for cooking in ['烧烤', 'barbecue']):
        labels.extend(['cooking_method', 'grilling'])
    elif any(cooking in word_lower for cooking in ['烤肉', 'barbecue']):
        labels.extend(['cooking_method', 'grilling'])
    elif any(cooking in word_lower for cooking in ['火锅', 'hot pot']):
        labels.extend(['cooking_method', 'boiling'])
    
    # Storage and preservation
    if any(storage in word_lower for storage in ['冷冻', 'freezing']):
        labels.extend(['storage_preservation', 'freezing_method'])
    elif any(storage in word_lower for storage in ['冷藏', 'refrigeration']):
        labels.extend(['storage_preservation', 'refrigeration_method'])
    
    # Social and sharing
    if any(social in word_lower for social in ['分享', 'share']):
        labels.extend(['social_sharing', 'content_sharing'])
    elif any(social in word_lower for social in ['推荐', 'recommend']):
        labels.extend(['social_sharing', 'recommendation'])
    
    # Lifestyle
    if any(life in word_lower for life in ['生活', 'life']):
        labels.extend(['lifestyle', 'daily_life'])
    elif any(life in word_lower for life in ['日常', 'daily']):
        labels.extend(['lifestyle', 'routine'])
    
    # Shopping behavior
    if any(shopping in word_lower for shopping in ['团购', 'group buying']):
        labels.extend(['shopping_behavior', 'bulk_purchasing'])
    elif any(shopping in word_lower for shopping in ['购买', 'buy']):
        labels.extend(['shopping_behavior', 'purchasing'])
    
    # Information seeking
    if any(info in word_lower for info in ['知道', 'know']):
        labels.extend(['information_seeking', 'knowledge'])
    elif any(info in word_lower for info in ['请问', 'excuse me']):
        labels.extend(['information_seeking', 'question_asking'])
    elif any(info in word_lower for info in ['了解', 'learn']):
        labels.extend(['information_seeking', 'learning'])
    
    # Emotional expression
    if any(emotion in word_lower for emotion in ['偷笑', 'smirk']):
        labels.extend(['emotional_expression', 'amusement'])
    elif any(emotion in word_lower for emotion in ['doge', 'doge']):
        labels.extend(['emotional_expression', 'meme_expression'])
    
    # Market and business
    if any(market in word_lower for market in ['市场', 'market']):
        labels.extend(['market_business', 'marketplace'])
    elif any(market in word_lower for market in ['批发', 'wholesale']):
        labels.extend(['market_business', 'wholesale_trade'])
    
    # Product features
    if any(feature in word_lower for feature in ['特点', 'features']):
        labels.extend(['product_features', 'characteristics'])
    
    # Meat quality characteristics
    if any(quality in word_lower for quality in ['肉质', 'meat quality']):
        labels.extend(['quality_characteristics', 'meat_quality'])
    elif any(quality in word_lower for quality in ['脂肪', 'fat']):
        labels.extend(['quality_characteristics', 'fat_content'])
    
    # Cooking and preparation terms
    if any(prep in word_lower for prep in ['原切', 'original cut']):
        labels.extend(['cooking_preparation', 'cutting_method'])
    
    # User behavior patterns
    if any(behavior in word_lower for behavior in ['留子', '留学生']):
        labels.extend(['user_demographic', 'international_student'])
    elif any(behavior in word_lower for behavior in ['我们', 'we']):
        labels.extend(['user_demographic', 'community'])
    elif any(behavior in word_lower for behavior in ['自己', 'self']):
        labels.extend(['user_demographic', 'personal'])
    
    # Product availability
    if any(avail in word_lower for avail in ['需要', 'need']):
        labels.extend(['product_availability', 'demand_expression'])
    elif any(avail in word_lower for avail in ['适合', 'suitable']):
        labels.extend(['product_availability', 'suitability'])
    
    # Product categories
    if any(category in word_lower for category in ['产品', 'product']):
        labels.extend(['product_category', 'general_product'])
    elif any(category in word_lower for category in ['食材', 'ingredient']):
        labels.extend(['product_category', 'cooking_ingredient'])
    elif any(category in word_lower for category in ['食品', 'food']):
        labels.extend(['product_category', 'food_item'])
    elif any(category in word_lower for category in ['肉类', 'meat']):
        labels.extend(['product_category', 'meat_category'])
    
    # Time and frequency
    if any(time in word_lower for time in ['时候', 'time']):
        labels.extend(['time_frequency', 'temporal_reference'])
    elif any(time in word_lower for time in ['之前', 'before']):
        labels.extend(['time_frequency', 'temporal_sequence'])
    elif any(time in word_lower for time in ['今天', 'today']):
        labels.extend(['time_frequency', 'current_time'])
    
    # Location and direction
    if any(location in word_lower for location in ['国内', 'domestic']):
        labels.extend(['location_direction', 'domestic_market'])
    elif any(location in word_lower for location in ['这里', 'here']):
        labels.extend(['location_direction', 'current_location'])
    elif any(location in word_lower for location in ['哪里', 'where']):
        labels.extend(['location_direction', 'location_inquiry'])
    
    # Quantity and measurement
    if any(quantity in word_lower for quantity in ['一般', 'general']):
        labels.extend(['quantity_measurement', 'general_quantity'])
    elif any(quantity in word_lower for quantity in ['一点', 'little']):
        labels.extend(['quantity_measurement', 'small_quantity'])
    
    # Communication and interaction
    if any(comm in word_lower for comm in ['出来', 'come out']):
        labels.extend(['communication_interaction', 'result_expression'])
    elif any(comm in word_lower for comm in ['不是', 'not']):
        labels.extend(['communication_interaction', 'negation'])
    elif any(comm in word_lower for comm in ['或者', 'or']):
        labels.extend(['communication_interaction', 'alternative'])
    elif any(comm in word_lower for comm in ['如果', 'if']):
        labels.extend(['communication_interaction', 'conditional'])
    
    # If no specific labels found, add contextual analysis
    if not labels:
        # Analyze word characteristics
        if len(word) <= 2:
            labels.append('short_word')
        elif len(word) >= 4:
            labels.append('long_word')
        
        # Check if it's a number or code
        if re.match(r'^[A-Za-z0-9]+$', word):
            labels.append('code_number')
        
        # Check if it's a foreign word
        if re.match(r'^[A-Za-z]+$', word):
            labels.append('foreign_word')
        
        # Add general context based on frequency
        labels.append('high_frequency_word')
    
    return list(set(labels))  # Remove duplicates

def process_words_with_detailed_labels(input_file: str, output_file: str, min_frequency: int = 10):
    """
    Process words with detailed labeling
    """
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Filter words with frequency >= min_frequency
    filtered_data = [word for word in data if word['frequency'] >= min_frequency]
    
    print(f"Processing {len(filtered_data)} words with frequency >= {min_frequency}")
    
    # Add detailed labels
    labeled_data = []
    for word_obj in filtered_data:
        word = word_obj['zh']
        english = word_obj['en']
        frequency = word_obj['frequency']
        
        labels = get_detailed_labels(word, english)
        
        labeled_obj = {
            'zh': word,
            'en': english,
            'frequency': frequency,
            'labels': labels
        }
        
        labeled_data.append(labeled_obj)
    
    # Save results
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(labeled_data, f, ensure_ascii=False, indent=2)
    
    print(f"Detailed labeled data saved to: {output_file}")
    
    # Analyze label distribution
    label_counts = {}
    for word_obj in labeled_data:
        for label in word_obj['labels']:
            label_counts[label] = label_counts.get(label, 0) + 1
    
    print(f"\nLabel distribution ({len(label_counts)} unique labels):")
    for label, count in sorted(label_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {label}: {count} words")
    
    # Show examples
    print(f"\nExample detailed labels:")
    for i, word_obj in enumerate(labeled_data[:10]):
        print(f"  {word_obj['zh']} ({word_obj['frequency']}) -> {word_obj['labels']}")

if __name__ == "__main__":
    input_file = "word_frequency/xhs_all_content_wordcloud_frequencies_translated.json"
    output_file = "word_frequency/xhs_all_content_wordcloud_frequencies_detailed_labeled.json"
    
    process_words_with_detailed_labels(input_file, output_file, min_frequency=10)
