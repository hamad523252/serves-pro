import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'destructive' | 'warning';
}

/**
 * مكون عرض رسائل الخطأ الموحد
 * يحل محل التكرارات في common/ و ui/
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  className = '',
  size = 'md',
  variant = 'destructive'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          container: 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200/50 dark:border-amber-800/30',
          text: 'text-amber-700 dark:text-amber-300',
          icon: 'bg-amber-100 dark:bg-amber-800/50 text-amber-600 dark:text-amber-300'
        };
      case 'destructive':
      default:
        return {
          container: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200/50 dark:border-red-800/30',
          text: 'text-red-700 dark:text-red-300',
          icon: 'bg-red-100 dark:bg-red-800/50 text-red-600 dark:text-red-300'
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-3',
          icon: 'w-6 h-6',
          iconSize: 'w-3 h-3',
          text: 'text-xs'
        };
      case 'lg':
        return {
          container: 'p-5',
          icon: 'w-10 h-10',
          iconSize: 'w-5 h-5',
          text: 'text-base'
        };
      case 'md':
      default:
        return {
          container: 'p-4',
          icon: 'w-8 h-8',
          iconSize: 'w-4 h-4',
          text: 'text-sm'
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <div className={`flex items-center gap-3 ${variantStyles.container} ${sizeStyles.container} rounded-xl border ${className}`}>
      <div className="flex-shrink-0">
        <div className={`${sizeStyles.icon} rounded-full ${variantStyles.icon} flex items-center justify-center`}>
          <AlertTriangle className={`${sizeStyles.iconSize}`} />
        </div>
      </div>
      <span className={`${sizeStyles.text} font-medium leading-relaxed ${variantStyles.text}`}>
        {message}
      </span>
    </div>
  );
};

export default ErrorMessage;

