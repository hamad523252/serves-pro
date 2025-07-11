import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * دالة مساعدة لدمج CSS classes مع Tailwind CSS
 * تجمع بين clsx و tailwind-merge لحل تضارب الكلاسات
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

