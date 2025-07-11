import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * مكون حدود الأخطاء لالتقاط الأخطاء في التطبيق
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              حدث خطأ غير متوقع
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              نعتذر، حدث خطأ في التطبيق. يرجى المحاولة مرة أخرى أو تحديث الصفحة.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تفاصيل الخطأ (وضع التطوير)
                </summary>
                <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                variant="primary"
                onClick={this.handleReset}
                icon={<RefreshCw className="w-4 h-4" />}
              >
                المحاولة مرة أخرى
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                تحديث الصفحة
              </Button>
            </div>

            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
              النظام الحكومي المحسن - إصدار 2.0
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

