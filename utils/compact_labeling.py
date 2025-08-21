#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Compact labeling for words with fewer, business-focused categories.
Adds 'not_important' when a word is likely unrelated to SFF operations.
"""

import json
from typing import List

# Core compact categories
COMPACT_CATEGORIES = {
    'product_meat': [
        '牛肉','猪肉','羊肉','鸡肉','牛排','牛蛙','菲力','肋排','里脊','rump','tenderloin','sirloin','ribeye','brisket','flank','skirt','shank'
    ],
    'cut_part': [
        '部位','肋条','牛腩','板腱','西冷','眼肉','肩胛','牛小排','里脊肉','腱子','吊龙','臀盖','臀尖','rib','ribs','brisket','flank','skirt','shank'
    ],
    'quality': [
        '新鲜','口感','品质','肉质','脂肪','嫩度','纹理','油花','鲜嫩','颜色','香味','风味','taste','fresh','quality','texture','fat'
    ],
    'origin_country': [
        '澳洲','澳大利亚','新西兰','日本','美国','中国','阿根廷','巴西','西班牙','马来西亚','瑞士','俄罗斯','australia','new zealand','japan','usa','china','argentina','brazil','spain','switzerland','russia','malaysia'
    ],
    'city_region': [
        '奥克兰','悉尼','珀斯','基督城','上海','北京','auckland','sydney','perth','christchurch','shanghai','beijing'
    ],
    'retail_channel': [
        '超市','肉店','butcher','supermarket','烤肉店','餐厅','colse','coles','wws','woolworth','lidl','costco','aldi','paknsave','ole','countdown'
    ],
    'trade_import': [
        '进口','清关','报关','海关','备案','检疫','关税','报检','通关','import','customs','clearance','declaration','quarantine','tariff'
    ],
    'price_value': [
        '价格','便宜','贵','划算','性价比','优惠','打折','cost','price','cheap','expensive','value'
    ],
    'cooking_usage': [
        '烤肉','烧烤','火锅','红烧','炖煮','解冻','煎制','烤制','烹饪','菜谱','barbecue','grill','hotpot','roast','stew','boil','fry'
    ],
    'social_intent': [
        '推荐','分享','探店','回购','分享','推荐','review','share','recommend'
    ],
    'demand_intent': [
        '需要','适合','购买','团购','买到','下单','采购','demand','buy','purchase','order'
    ],
    'brand': [
        '安格斯','angus','a5','wagyu','blackmore','mayura','teys','mb','msa'
    ],
}

# Words that are likely not important to SFF operations
NOT_IMPORTANT_CUES = set([
    '偷笑','doge','害羞','飞吻','捂脸','哈哈','哈哈哈','哈哈哈哈','yyds','视频','图片','地址','plog',
    '我们','自己','他们','或者','如果','时候','这里','那里','哪里','不是','出来','一点','一般','而且',
])

# Contextual/noise tags to ignore when counting categories
CONTEXT_NOISE = set([
    'high_frequency_word','short_word','long_word','code_number','foreign_word'
])


def to_lower(s: str) -> str:
    try:
        return s.lower()
    except Exception:
        return s


def get_compact_labels(zh: str, en: str) -> List[str]:
    """Return compact labels for a word."""
    labels: List[str] = []
    z = to_lower(zh)
    e = to_lower(en)

    # Assign compact categories
    for label, keywords in COMPACT_CATEGORIES.items():
        for kw in keywords:
            if kw in z or kw in e:
                labels.append(label)
                break

    # Mark not important if matches explicit cues and has no core business label
    if not labels:
        for cue in NOT_IMPORTANT_CUES:
            if cue in z or cue in e:
                labels.append('not_important')
                break

    # Fallback: if still no label, put into 'other'
    if not labels:
        labels.append('other')

    return sorted(list(set(labels)))


def relabel_compact(input_file: str, output_file: str, min_frequency: int = 1):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    out = []
    for item in data:
        if item.get('frequency', 0) < min_frequency:
            continue
        zh = item.get('zh', '')
        en = item.get('en', '')
        freq = item.get('frequency', 0)
        labels = get_compact_labels(zh, en)
        out.append({
            'zh': zh,
            'en': en,
            'frequency': freq,
            'labels': labels,
        })

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    # Print summary
    label_counts = {}
    for w in out:
        for l in w['labels']:
            if l in CONTEXT_NOISE:
                continue
            label_counts[l] = label_counts.get(l, 0) + 1

    print(f"Relabeled {len(out)} words → {output_file}")
    print("Label distribution (compact):")
    for k, v in sorted(label_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {k}: {v}")


if __name__ == '__main__':
    # Input: translated words with frequency
    INPUT = 'word_frequency/xhs_all_content_wordcloud_frequencies_translated.json'
    OUTPUT = 'word_frequency/xhs_all_content_wordcloud_frequencies_compact_labeled.json'
    relabel_compact(INPUT, OUTPUT, min_frequency=1)
