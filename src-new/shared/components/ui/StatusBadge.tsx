import React from 'react';
import { CheckCircle, Clock, AlertTriangle, XCircle, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

export type StatusType = 'success' | 'warning' | 'error' | 'pending' | 'info';

export interface StatusBadgeProps {
  status: StatusType;
  text: string;
  icon?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * مكون شارة الحالة الموحد
 * يحل محل التكرارات في common/ و shared/
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  icon,
  className = '',
  size = 'md'
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          bgColor: 'bg-green-100 dark:bg-green-900/40',
          textColor: 'text-green-800 dark:text-green-300',
          borderColor: 'border-green-200 dark:border-green-800',
          defaultIcon: <CheckCircle className="w-4 h-4" />
        };
      case 'warning':
        return {
          bgColor: 'bg-amber-100 dark:bg-amber-900/40',
          textColor: 'text-amber-800 dark:text-amber-300',
          borderColor: 'border-amber-200 dark:border-amber-800',
          defaultIcon: <AlertTriangle className="w-4 h-4" />
        };
      case 'error':
        return {
          bgColor: 'bg-red-100 dark:bg-red-900/40',
          textColor: 'text-red-800 dark:text-red-300',
          borderColor: 'border-red-200 dark:border-red-800',
          defaultIcon: <XCircle className="w-4 h-4" />
        };
      case 'pending':
        return {
          bgColor: 'bg-blue-100 dark:bg-blue-900/40',
          textColor: 'text-blue-800 dark:text-blue-300',
          borderColor: 'border-blue-200 dark:border-blue-800',
          defaultIcon: <Clock className="w-4 h-4" />
        };
      case 'info':
      default:
        return {
          bgColor: 'bg-gray-100 dark:bg-gray-800/70',
          textColor: 'text-gray-700 dark:text-gray-300',
          borderColor: 'border-gray-200 dark:border-gray-700',
          defaultIcon: <Info className="w-4 h-4" />
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'px-2 py-0.5 text-xs gap-1',
          icon: 'w-3 h-3'
        };
      case 'lg':
        return {
          container: 'px-4 py-1.5 text-sm gap-2',
          icon: 'w-5 h-5'
        };
      case 'md':
      default:
        return {
          container: 'px-3 py-1 text-xs gap-1.5',
          icon: 'w-4 h-4'
        };
    }
  };

  const { bgColor, textColor, borderColor, defaultIcon } = getStatusConfig();
  const { container: sizeContainer, icon: iconSize } = getSizeClasses();

  // تحديث حجم الأيقونة المخصصة أو الافتراضية
  const displayIcon = icon ? (
    React.cloneElement(icon as React.ReactElement, { 
      className: cn(iconSize, (icon as React.ReactElement).props.className) 
    })
  ) : (
    React.cloneElement(defaultIcon, { className: iconSize })
  );

  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        bgColor,
        textColor,
        borderColor,
        sizeContainer,
        className
      )}
    >
      {displayIcon}
      <span>{text}</span>
    </span>
  );
};

export default StatusBadge;

