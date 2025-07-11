import React from 'react';
import { useDispatch } from 'react-redux';
import { User, FileText, Clock, LogOut } from 'lucide-react';
import { AppDispatch } from '../../../app/store';
import { logout } from '../../../app/store/slices/authSlice';
import { Button, StatusBadge } from '../../../shared/components/ui';

const EmployeeDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <User className="w-8 h-8 text-green-600 ml-3" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                لوحة تحكم الموظف
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
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-green-900 dark:text-green-100">
            مهامك اليومية
          </h2>
          <p className="text-green-700 dark:text-green-200 mt-2">
            النظام المحسن يجعل عملك أسرع وأسهل
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <FileText className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white">طلبات جديدة</h3>
            <p className="text-2xl font-bold text-blue-600">12</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <Clock className="w-8 h-8 text-orange-600 mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white">قيد المراجعة</h3>
            <p className="text-2xl font-bold text-orange-600">8</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <User className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="font-semibold text-gray-900 dark:text-white">مكتملة</h3>
            <p className="text-2xl font-bold text-green-600">45</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;

