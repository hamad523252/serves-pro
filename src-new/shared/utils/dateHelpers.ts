/**
 * مساعدات التاريخ - التاريخ الميلادي فقط
 */

/**
 * تنسيق التاريخ بالعربية والتقويم الميلادي
 */
export const formatGregorianDate = (date: string | Date, includeTime: boolean = false): string => {
  const dateObj = new Date(date);
  
  const options: Intl.DateTimeFormatOptions = {
    calendar: 'gregory', // التقويم الميلادي صراحة
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return new Intl.DateTimeFormat('ar', options).format(dateObj);
};

/**
 * تنسيق التاريخ المختصر بالميلادي
 */
export const formatShortGregorianDate = (date: string | Date): string => {
  const dateObj = new Date(date);
  
  return new Intl.DateTimeFormat('ar', {
    calendar: 'gregory',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(dateObj);
};

/**
 * تنسيق الوقت فقط
 */
export const formatTime = (date: string | Date): string => {
  const dateObj = new Date(date);
  
  return new Intl.DateTimeFormat('ar', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(dateObj);
};

/**
 * تنسيق التاريخ والوقت كاملاً بالميلادي
 */
export const formatFullGregorianDateTime = (date: string | Date): string => {
  const dateObj = new Date(date);
  
  return new Intl.DateTimeFormat('ar', {
    calendar: 'gregory',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long'
  }).format(dateObj);
};

/**
 * الحصول على التاريخ الحالي منسق بالميلادي
 */
export const getCurrentGregorianDate = (): string => {
  return formatGregorianDate(new Date());
};

/**
 * الحصول على التاريخ والوقت الحالي منسق بالميلادي
 */
export const getCurrentGregorianDateTime = (): string => {
  return formatGregorianDate(new Date(), true);
};

/**
 * تحويل التاريخ لصيغة ISO مع الوقت المحلي
 */
export const toLocalISOString = (date: Date = new Date()): string => {
  const offset = date.getTimezoneOffset();
  const localTime = new Date(date.getTime() - (offset * 60 * 1000));
  return localTime.toISOString().split('.')[0];
};

/**
 * حساب الفرق بين تاريخين بالأيام
 */
export const daysDifference = (date1: string | Date, date2: string | Date): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * التحقق من أن التاريخ هو اليوم
 */
export const isToday = (date: string | Date): boolean => {
  const today = new Date();
  const checkDate = new Date(date);
  
  return today.getFullYear() === checkDate.getFullYear() &&
         today.getMonth() === checkDate.getMonth() &&
         today.getDate() === checkDate.getDate();
};

/**
 * التحقق من أن التاريخ هو بالأمس
 */
export const isYesterday = (date: string | Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const checkDate = new Date(date);
  
  return yesterday.getFullYear() === checkDate.getFullYear() &&
         yesterday.getMonth() === checkDate.getMonth() &&
         yesterday.getDate() === checkDate.getDate();
};

/**
 * تنسيق التاريخ النسبي (اليوم، أمس، الخ)
 */
export const formatRelativeDate = (date: string | Date): string => {
  if (isToday(date)) {
    return 'اليوم ' + formatTime(date);
  }
  
  if (isYesterday(date)) {
    return 'أمس ' + formatTime(date);
  }
  
  const daysDiff = daysDifference(new Date(), date);
  
  if (daysDiff <= 7) {
    return `منذ ${daysDiff} أيام`;
  }
  
  return formatGregorianDate(date);
};

