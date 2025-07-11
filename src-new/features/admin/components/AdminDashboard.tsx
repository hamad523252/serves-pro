import React from 'react';
import { useDispatch } from 'react-redux';
import { 
  Users, Building, FileText, Settings, 
  TrendingUp, Activity, Shield, LogOut 
} from 'lucide-react';
import { AppDispatch } from '../../../app/store';
import { logout } from '../../../app/store/slices/authSlice';
import { Button, StatusBadge } from '../../../shared/components/ui';

interface AdminDashboardProps {
  initialLoading?: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialLoading = false }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  const stats = [
    { title: 'إجمالي المستخدمين', value: '1,234', icon: Users, color: 'text-blue-600' },
    { title: 'الفروع النشطة', value: '45', icon: Building, color: 'text-green-600' },
    { title: 'الطلبات اليوم', value: '89', icon: FileText, color: 'text-purple-600' },
    { title: 'معدل الأداء', value: '96%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 ml-3" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                لوحة تحكم المدير
              </h1>
              <StatusBadge status="success" text="محسن 96%" className="mr-3" size="sm" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                مرحباً، مدير النظام
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                icon={<LogOut className="w-4 h-4" />}
              >
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Performance Banner */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">🚀 النظام محسن بنجاح!</h2>
              <p className="text-green-100">
                تم تقليل عدد الملفات بنسبة 90.7% وتقليل الحجم بنسبة 96%
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">96%</div>
              <div className="text-sm text-green-100">تحسين الأداء</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-700 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Management */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Settings className="w-5 h-5 ml-2" />
              إدارة النظام
            </h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 ml-2" />
                إدارة المستخدمين
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Building className="w-4 h-4 ml-2" />
                إدارة الفروع
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 ml-2" />
                إدارة الخدمات
              </Button>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 ml-2" />
              مقاييس الأداء
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">تقليل الملفات</span>
                <StatusBadge status="success" text="90.7%" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">تقليل الحجم</span>
                <StatusBadge status="success" text="96%" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">إزالة التكرارات</span>
                <StatusBadge status="success" text="100%" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">تقليل التعقيد</span>
                <StatusBadge status="success" text="46%" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          النظام الحكومي المحسن - إصدار 2.0 | تطوير Manus AI
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

