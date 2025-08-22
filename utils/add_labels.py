#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Add labels to words for better user demand analysis
"""

import json
import re
from typing import List, Dict

def categorize_word(word: str, english: str) -> List[str]:
    """
    Categorize a word based on its meaning and context
    
    Args:
        word (str): Chinese word
        english (str): English translation
        
    Returns:
        List[str]: List of labels
    """
    labels = []
    
    # Convert to lowercase for easier matching
    word_lower = word.lower()
    english_lower = english.lower()
    
    # Meat and food categories
    if any(meat in word_lower for meat in ['牛肉', '猪肉', '羊肉', '鸡肉', '牛排', 'pork', 'beef', 'lamb', 'chicken', 'steak']):
        labels.append('meat_product')
    
    if any(food in word_lower for food in ['美食', '好吃', 'tasty', 'gourmet', 'food']):
        labels.append('food_quality')
    
    # Location and origin
    if any(country in word_lower for country in ['澳洲', '澳大利亚', '新西兰', '日本', '美国', '中国', '新加坡', '巴西', '阿根廷', 'australia', 'new zealand', 'japan', 'usa', 'china', 'singapore', 'brazil', 'argentina']):
        labels.append('country_origin')
    
    if any(city in word_lower for city in ['奥克兰', '悉尼', 'auckland', 'sydney']):
        labels.append('city_location')
    
    # Shopping and retail
    if any(shop in word_lower for shop in ['超市', '肉店', 'supermarket', 'butcher']):
        labels.append('retail_location')
    
    if any(brand in word_lower for brand in ['coles', 'a5', '安格斯', 'angus']):
        labels.append('brand')
    
    # Import and trade
    if any(trade in word_lower for trade in ['进口', '海关', '报关', '清关', 'import', 'customs', 'clearance']):
        labels.append('import_trade')
    
    # Price and value
    if any(price in word_lower for price in ['价格', '便宜', '贵', 'price', 'cheap', 'expensive']):
        labels.append('price_value')
    
    # Quality and characteristics
    if any(quality in word_lower for quality in ['品质', '新鲜', '口感', '肉质', 'quality', 'fresh', 'taste', 'texture']):
        labels.append('quality_characteristics')
    
    # Cooking and preparation
    if any(cooking in word_lower for cooking in ['烧烤', '烤肉', '火锅', 'barbecue', 'grill', 'hotpot']):
        labels.append('cooking_method')
    
    # Storage and preservation
    if any(storage in word_lower for storage in ['冷冻', '冷藏', 'freezing', 'refrigeration']):
        labels.append('storage_preservation')
    
    # Social and sharing
    if any(social in word_lower for social in ['分享', '推荐', '推荐', 'share', 'recommend']):
        labels.append('social_sharing')
    
    # Lifestyle and experience
    if any(life in word_lower for life in ['生活', '日常', 'life', 'daily']):
        labels.append('lifestyle')
    
    # Shopping behavior
    if any(shopping in word_lower for shopping in ['团购', '购买', 'buy', 'group buy']):
        labels.append('shopping_behavior')
    
    # Information seeking
    if any(info in word_lower for info in ['知道', '请问', '了解', 'know', 'ask', 'understand']):
        labels.append('information_seeking')
    
    # Emotional expression
    if any(emotion in word_lower for emotion in ['偷笑', 'doge', 'smile', 'laugh']):
        labels.append('emotional_expression')
    
    # Meat cuts and parts
    if any(cut in word_lower for cut in ['部位', '肋条', '牛腩', 'part', 'rib', 'brisket']):
        labels.append('meat_cuts')
    
    # Market and business
    if any(market in word_lower for market in ['市场', '批发', 'market', 'wholesale']):
        labels.append('market_business')
    
    # Product features
    if any(feature in word_lower for feature in ['特点', '特色', 'feature', 'characteristic']):
        labels.append('product_features')
    
    # If no specific category found, add general label
    if not labels:
        labels.append('general')
    
    return labels

def add_labels_to_words(input_file: str, output_file: str, min_frequency: int = 5):
    """
    Add labels to words with frequency >= min_frequency
    
    Args:
        input_file (str): Path to input JSON file
        output_file (str): Path to output JSON file
        min_frequency (int): Minimum frequency threshold
    """
    # Load data
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Filter words with frequency >= min_frequency
    filtered_data = [word for word in data if word['frequency'] >= min_frequency]
    
    print(f"Total words: {len(data)}")
    print(f"Words with frequency >= {min_frequency}: {len(filtered_data)}")
    
    # Add labels to each word
    labeled_data = []
    for word_obj in filtered_data:
        word = word_obj['zh']
        english = word_obj['en']
        frequency = word_obj['frequency']
        
        # Get labels for this word
        labels = categorize_word(word, english)
        
        # Create new object with labels
        labeled_obj = {
            'zh': word,
            'en': english,
            'frequency': frequency,
            'labels': labels
        }
        
        labeled_data.append(labeled_obj)
    
    # Save labeled data
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(labeled_data, f, ensure_ascii=False, indent=2)
    
    print(f"Labeled data saved to: {output_file}")
    
    # Analyze label distribution
    label_counts = {}
    for word_obj in labeled_data:
        for label in word_obj['labels']:
            label_counts[label] = label_counts.get(label, 0) + 1
    
    print("\nLabel distribution:")
    for label, count in sorted(label_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {label}: {count} words")
    
    # Show some examples
    print("\nExample labeled words:")
    for i, word_obj in enumerate(labeled_data[:10]):
        print(f"  {word_obj['zh']} ({word_obj['frequency']}) -> {word_obj['labels']}")

if __name__ == "__main__":
    input_file = "word_frequency/xhs_all_content_wordcloud_frequencies_translated.json"
    output_file = "word_frequency/xhs_all_content_wordcloud_frequencies_labeled.json"
    
    add_labels_to_words(input_file, output_file, min_frequency=5)
