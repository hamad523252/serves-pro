import React, { useState } from 'react';
import { 
  User, Phone, Mail, Calendar, MapPin, 
  FileText, Check, UserCheck, Heart, Briefcase,
  CheckCircle, XCircle, AlertTriangle, Clock
} from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import StatusBadge from '../ui/StatusBadge';
import { formatGregorianDate } from '../../utils/dateHelpers';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: 'registration' | 'request' | 'user' | 'service';
  userRole?: 'admin' | 'branch_manager' | 'employee' | 'beneficiary';
  onStatusChange?: (id: string, status: string, notes?: string) => Promise<void>;
  actions?: React.ReactNode;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
}

/**
 * مكون نافذة التفاصيل العام
 * يحل محل جميع نوافذ التفاصيل المكررة في المشروع
 */
const DetailsModal: React.FC<DetailsModalProps> = ({
  isOpen,
  onClose,
  data,
  type,
  userRole,
  onStatusChange,
  actions
}) => {
  const [activeTab, setActiveTab] = useState<string>('info');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!data) return null;

  const getTabsConfig = (): TabConfig[] => {
    const baseTabs: TabConfig[] = [
      { id: 'info', label: 'المعلومات الأساسية', icon: <User className="w-4 h-4" /> }
    ];

    if (type === 'registration') {
      baseTabs.push(
        { id: 'documents', label: 'المستندات', icon: <FileText className="w-4 h-4" /> }
      );
    }

    if (onStatusChange || actions) {
      baseTabs.push(
        { id: 'actions', label: 'الإجراءات', icon: <Check className="w-4 h-4" /> }
      );
    }

    return baseTabs;
  };

  const getStatusBadgeProps = (status: string) => {
    const statusMap: Record<string, { type: 'success' | 'warning' | 'error' | 'pending' | 'info', text: string }> = {
      'pending': { type: 'pending', text: 'قيد المراجعة' },
      'under_review': { type: 'warning', text: 'تحت المراجعة' },
      'under_manager_review': { type: 'warning', text: 'مراجعة المدير' },
      'approved': { type: 'success', text: 'مُوافق عليه' },
      'rejected': { type: 'error', text: 'مرفوض' },
      'completed': { type: 'success', text: 'مكتمل' },
      'active': { type: 'success', text: 'نشط' },
      'inactive': { type: 'error', text: 'غير نشط' },
    };

    return statusMap[status] || { type: 'info', text: status };
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!onStatusChange) return;

    setIsSubmitting(true);
    try {
      await onStatusChange(data.id, newStatus, notes);
      onClose();
    } catch (error) {
      console.error('Error changing status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInfoTab = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.full_name && (
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">الاسم الكامل</p>
              <p className="font-medium">{data.full_name}</p>
            </div>
          </div>
        )}

        {data.national_id && (
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">رقم الهوية</p>
              <p className="font-medium">{data.national_id}</p>
            </div>
          </div>
        )}

        {data.phone && (
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">رقم الهاتف</p>
              <p className="font-medium">{data.phone}</p>
            </div>
          </div>
        )}

        {data.email && (
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">البريد الإلكتروني</p>
              <p className="font-medium">{data.email}</p>
            </div>
          </div>
        )}

        {data.birth_date && (
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">تاريخ الميلاد</p>
              <p className="font-medium">{formatGregorianDate(data.birth_date)}</p>
            </div>
          </div>
        )}

        {data.address && (
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">العنوان</p>
              <p className="font-medium">{data.address}</p>
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      {data.status && (
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm text-gray-500 mb-2">الحالة</p>
            <StatusBadge {...getStatusBadgeProps(data.status)} />
          </div>
        </div>
      )}

      {/* Additional Information */}
      {data.notes && (
        <div>
          <p className="text-sm text-gray-500 mb-2">ملاحظات</p>
          <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            {data.notes}
          </p>
        </div>
      )}
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-4">
      <p className="text-gray-600 dark:text-gray-400">
        المستندات المرفقة مع الطلب
      </p>
      {/* Add documents rendering logic here */}
    </div>
  );

  const renderActionsTab = () => (
    <div className="space-y-6">
      {onStatusChange && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ملاحظات الإجراء
            </label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أدخل ملاحظاتك هنا..."
              multiline
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            {userRole === 'employee' && data.status === 'pending' && (
              <Button
                variant="success"
                onClick={() => handleStatusChange('under_manager_review')}
                isLoading={isSubmitting}
              >
                <CheckCircle className="w-4 h-4" />
                إكمال المراجعة
              </Button>
            )}

            {userRole === 'branch_manager' && data.status === 'under_manager_review' && (
              <>
                <Button
                  variant="success"
                  onClick={() => handleStatusChange('approved')}
                  isLoading={isSubmitting}
                >
                  <CheckCircle className="w-4 h-4" />
                  موافقة
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleStatusChange('rejected')}
                  isLoading={isSubmitting}
                >
                  <XCircle className="w-4 h-4" />
                  رفض
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {actions && (
        <div className="border-t pt-4">
          {actions}
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return renderInfoTab();
      case 'documents':
        return renderDocumentsTab();
      case 'actions':
        return renderActionsTab();
      default:
        return renderInfoTab();
    }
  };

  const tabs = getTabsConfig();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`تفاصيل ${type === 'registration' ? 'التسجيل' : type === 'request' ? 'الطلب' : 'العنصر'}`}
      size="lg"
    >
      <div className="flex flex-col h-full">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </Modal>
  );
};

export default DetailsModal;

