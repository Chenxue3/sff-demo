#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Translate Chinese words to English using Google Cloud Translation API
"""

import json
import os
import time
from typing import List, Dict
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class GoogleTranslateAPI:
    def __init__(self):
        self.api_key = os.getenv('Google_Translate_API_Key')
        if not self.api_key:
            raise ValueError("Google_Translate_API_Key not found in environment variables")
        
        self.base_url = "https://translation.googleapis.com/language/translate/v2"
    
    def translate_text(self, text: str, source_lang: str = 'zh', target_lang: str = 'en') -> str:
        """
        Translate text using Google Cloud Translation API
        
        Args:
            text (str): Text to translate
            source_lang (str): Source language code (default: 'zh')
            target_lang (str): Target language code (default: 'en')
            
        Returns:
            str: Translated text
        """
        url = f"{self.base_url}?key={self.api_key}"
        
        data = {
            'q': text,
            'source': source_lang,
            'target': target_lang,
            'format': 'text'
        }
        
        try:
            response = requests.post(url, data=data)
            response.raise_for_status()
            
            result = response.json()
            if 'data' in result and 'translations' in result['data']:
                return result['data']['translations'][0]['translatedText']
            else:
                print(f"Unexpected API response: {result}")
                return text
                
        except requests.exceptions.RequestException as e:
            print(f"Translation API error: {e}")
            return text
        except Exception as e:
            print(f"Unexpected error: {e}")
            return text

def load_word_frequency_data(file_path: str) -> List[Dict]:
    """Load word frequency data from JSON file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_translated_data(data: List[Dict], file_path: str):
    """Save translated data to JSON file"""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def translate_words_with_delay(words_data: List[Dict], translator: GoogleTranslateAPI, 
                             delay: float = 0.1, max_words: int = None) -> List[Dict]:
    """
    Translate words with rate limiting
    
    Args:
        words_data: List of word dictionaries
        translator: GoogleTranslateAPI instance
        delay: Delay between API calls in seconds
        max_words: Maximum number of words to translate (for testing)
    
    Returns:
        List of translated word dictionaries
    """
    translated_data = []
    
    # Limit words for testing if specified
    if max_words:
        words_data = words_data[:max_words]
    
    total_words = len(words_data)
    
    for i, word_obj in enumerate(words_data, 1):
        chinese_word = word_obj['zh']
        frequency = word_obj['frequency']
        
        print(f"Translating {i}/{total_words}: {chinese_word}")
        
        # Translate the word
        english_word = translator.translate_text(chinese_word)
        
        # Create new object with English translation
        translated_obj = {
            'zh': chinese_word,
            'en': english_word,
            'frequency': frequency
        }
        
        translated_data.append(translated_obj)
        
        # Add delay to respect API rate limits
        if i < total_words:
            time.sleep(delay)
    
    return translated_data

def main():
    """Main function"""
    try:
        # Initialize translator
        translator = GoogleTranslateAPI()
        
        # File paths
        input_file = "word_frequency/xhs_all_content_wordcloud_frequencies.json"
        output_file = "word_frequency/xhs_all_content_wordcloud_frequencies_translated.json"
        
        # Load data
        print("Loading word frequency data...")
        words_data = load_word_frequency_data(input_file)
        print(f"Loaded {len(words_data)} words")
        
        # For testing, you can limit the number of words
        # Set max_words to None to translate all words
        max_words = None  # Change this to None for all words
        
        # Translate words
        print("Starting translation...")
        translated_data = translate_words_with_delay(
            words_data, 
            translator, 
            delay=0.1,  # 100ms delay between requests
            max_words=max_words
        )
        
        # Save translated data
        print("Saving translated data...")
        save_translated_data(translated_data, output_file)
        
        print(f"Translation completed!")
        print(f"Translated {len(translated_data)} words")
        print(f"Output saved to: {output_file}")
        
        # Show some examples
        print("\nExample translations:")
        for i, word in enumerate(translated_data[:5]):
            print(f"{word['zh']} -> {word['en']} (frequency: {word['frequency']})")
            
    except Exception as e:
        print(f"Error: {e}")
        print("Please make sure you have:")
        print("1. Created a .env file with GOOGLE_TRANSLATE_API_KEY")
        print("2. Enabled Google Cloud Translation API")
        print("3. Have sufficient API quota")

if __name__ == "__main__":
    main()
