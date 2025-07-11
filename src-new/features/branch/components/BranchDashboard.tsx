import React from 'react';
import { useDispatch } from 'react-redux';
import { Building, Users, FileText, LogOut } from 'lucide-react';
import { AppDispatch } from '../../../app/store';
import { logout } from '../../../app/store/slices/authSlice';
import { Button, StatusBadge } from '../../../shared/components/ui';

interface BranchDashboardProps {
  initialLoading?: boolean;
}

const BranchDashboard: React.FC<BranchDashboardProps> = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building className="w-8 h-8 text-blue-600 ml-3" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                لوحة تحكم الفرع
              </h1>
              <StatusBadge status="success" text="محسن" className="mr-3" size="sm" />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(logout())}
              icon={<LogOut className="w-4 h-4" />}
            >
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100">
            مرحباً بك في النظام المحسن
          </h2>
          <p className="text-blue-700 dark:text-blue-200 mt-2">
            تم تحسين الأداء وتبسيط الواجهة لتجربة أفضل
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <Users className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white">الموظفين</h3>
            <p className="text-2xl font-bold text-green-600">24</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <FileText className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white">الطلبات</h3>
            <p className="text-2xl font-bold text-blue-600">156</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <Building className="w-8 h-8 text-purple-600 mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white">الخدمات</h3>
            <p className="text-2xl font-bold text-purple-600">8</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BranchDashboard;

