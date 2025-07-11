#!/usr/bin/env python3
"""
سكريبت تحليل الأداء ومقارنة البنية القديمة بالجديدة
"""

import os
import json
from pathlib import Path
from collections import defaultdict
import hashlib

def get_file_stats(directory):
    """حساب إحصائيات الملفات في مجلد معين"""
    stats = {
        'total_files': 0,
        'total_size': 0,
        'file_types': defaultdict(int),
        'duplicates': [],
        'large_files': []
    }
    
    file_hashes = defaultdict(list)
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.startswith('.'):
                continue
                
            file_path = os.path.join(root, file)
            try:
                file_size = os.path.getsize(file_path)
                stats['total_files'] += 1
                stats['total_size'] += file_size
                
                # تصنيف حسب نوع الملف
                ext = Path(file).suffix.lower()
                stats['file_types'][ext] += 1
                
                # البحث عن الملفات الكبيرة (أكبر من 50KB)
                if file_size > 50 * 1024:
                    stats['large_files'].append({
                        'path': file_path,
                        'size': file_size
                    })
                
                # البحث عن الملفات المكررة
                if ext in ['.tsx', '.ts', '.js', '.jsx']:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        file_hash = hashlib.md5(content.encode()).hexdigest()
                        file_hashes[file_hash].append(file_path)
                        
            except (OSError, UnicodeDecodeError):
                continue
    
    # تحديد الملفات المكررة
    for file_hash, paths in file_hashes.items():
        if len(paths) > 1:
            stats['duplicates'].append(paths)
    
    return stats

def analyze_component_complexity(directory):
    """تحليل تعقيد المكونات"""
    complexity_stats = {
        'total_components': 0,
        'avg_lines_per_component': 0,
        'complex_components': [],
        'simple_components': []
    }
    
    total_lines = 0
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts')) and not file.endswith('.d.ts'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        lines = len(f.readlines())
                        total_lines += lines
                        complexity_stats['total_components'] += 1
                        
                        if lines > 200:
                            complexity_stats['complex_components'].append({
                                'path': file_path,
                                'lines': lines
                            })
                        elif lines < 50:
                            complexity_stats['simple_components'].append({
                                'path': file_path,
                                'lines': lines
                            })
                            
                except (OSError, UnicodeDecodeError):
                    continue
    
    if complexity_stats['total_components'] > 0:
        complexity_stats['avg_lines_per_component'] = total_lines / complexity_stats['total_components']
    
    return complexity_stats

def format_size(size_bytes):
    """تنسيق حجم الملف"""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.1f} MB"

def main():
    """الدالة الرئيسية"""
    print("🔍 تحليل الأداء للمشروع الحكومي")
    print("=" * 50)
    
    # تحليل البنية القديمة
    print("\n📊 تحليل البنية القديمة (src/):")
    old_stats = get_file_stats('src')
    old_complexity = analyze_component_complexity('src')
    
    print(f"  • إجمالي الملفات: {old_stats['total_files']}")
    print(f"  • الحجم الإجمالي: {format_size(old_stats['total_size'])}")
    print(f"  • عدد المكونات: {old_complexity['total_components']}")
    print(f"  • متوسط الأسطر لكل مكون: {old_complexity['avg_lines_per_component']:.1f}")
    print(f"  • الملفات المكررة: {len(old_stats['duplicates'])}")
    print(f"  • المكونات المعقدة (>200 سطر): {len(old_complexity['complex_components'])}")
    
    # تحليل البنية الجديدة
    print("\n📊 تحليل البنية الجديدة (src-new/):")
    if os.path.exists('src-new'):
        new_stats = get_file_stats('src-new')
        new_complexity = analyze_component_complexity('src-new')
        
        print(f"  • إجمالي الملفات: {new_stats['total_files']}")
        print(f"  • الحجم الإجمالي: {format_size(new_stats['total_size'])}")
        print(f"  • عدد المكونات: {new_complexity['total_components']}")
        print(f"  • متوسط الأسطر لكل مكون: {new_complexity['avg_lines_per_component']:.1f}")
        print(f"  • الملفات المكررة: {len(new_stats['duplicates'])}")
        print(f"  • المكونات المعقدة (>200 سطر): {len(new_complexity['complex_components'])}")
        
        # مقارنة الأداء
        print("\n📈 مقارنة الأداء:")
        file_reduction = ((old_stats['total_files'] - new_stats['total_files']) / old_stats['total_files']) * 100
        size_reduction = ((old_stats['total_size'] - new_stats['total_size']) / old_stats['total_size']) * 100
        duplicate_reduction = len(old_stats['duplicates']) - len(new_stats['duplicates'])
        
        print(f"  • تقليل عدد الملفات: {file_reduction:.1f}%")
        print(f"  • تقليل الحجم: {size_reduction:.1f}%")
        print(f"  • إزالة التكرارات: {duplicate_reduction} ملف مكرر")
        
    else:
        print("  ⚠️  البنية الجديدة غير مكتملة بعد")
    
    # تفاصيل التكرارات في البنية القديمة
    print("\n🔍 تفاصيل التكرارات في البنية القديمة:")
    for i, duplicate_group in enumerate(old_stats['duplicates'][:5]):  # أول 5 مجموعات
        print(f"  {i+1}. ملفات مكررة:")
        for path in duplicate_group:
            print(f"     - {path}")
    
    # أنواع الملفات
    print("\n📁 توزيع أنواع الملفات (البنية القديمة):")
    for ext, count in sorted(old_stats['file_types'].items(), key=lambda x: x[1], reverse=True):
        if count > 1:
            print(f"  • {ext or 'بدون امتداد'}: {count} ملف")
    
    # المكونات المعقدة
    if old_complexity['complex_components']:
        print("\n⚠️  المكونات المعقدة التي تحتاج تبسيط:")
        for comp in old_complexity['complex_components'][:5]:
            print(f"  • {comp['path']}: {comp['lines']} سطر")
    
    print("\n✅ تم الانتهاء من تحليل الأداء")

if __name__ == "__main__":
    main()

