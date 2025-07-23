import React, { useState, useEffect } from 'react';

const DeviceEditModal = ({ device, onSave, onClose }) => {
  const [form, setForm] = useState({
    device_type: '',
    model: '',
    issue: '',
    estimated_cost: 0,
    total_cost: 0,
    repair_status: '',
    delivered: false,
    paid: false,
    delivery_date: ''
  });

  useEffect(() => {
    if (device) {
      setForm({
        device_type: device.device_type || '',
        model: device.model || '',
        issue: device.issue || device.problem || '',
        estimated_cost: device.estimated_cost || 0,
        total_cost: device.total_cost != null
          ? device.total_cost
          : (device.maintenanceActions?.reduce((sum, action) => sum + (action.cost || 0), 0) || 0),
        repair_status: device.repair_status || '',
        delivered: device.delivered || false,
        paid: device.paid || false,
        delivery_date: device.delivery_date ? device.delivery_date.split('T')[0] : ''
      });
    }
  }, [device]);

  if (!device) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...device, ...form });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative p-6 border w-full max-w-2xl shadow-xl rounded-lg bg-white">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h3 className="text-2xl font-bold text-gray-900">إدارة الجهاز - {device.receipt_number || device.receiptNumber}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع الجهاز *</label>
              <input
                type="text"
                name="device_type"
                value={form.device_type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: هاتف، لابتوب..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الموديل</label>
              <input
                type="text"
                name="model"
                value={form.model}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: iPhone 12..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">العطل *</label>
              <textarea
                name="issue"
                value={form.issue}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="وصف العطل أو المشكلة..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">التكلفة التقديرية (ل.س)</label>
              <input
                type="number"
                name="estimated_cost"
                min="0"
                step="0.01"
                value={form.estimated_cost}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">التكلفة الكلية (ل.س)</label>
              <input
                type="number"
                name="total_cost"
                min="0"
                step="0.01"
                value={form.total_cost}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">حالة الإصلاح</label>
              <select
                name="repair_status"
                value={form.repair_status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر الحالة...</option>
                <option value="pending">قيد الانتظار</option>
                <option value="in-progress">قيد التنفيذ</option>
                <option value="completed">مكتمل</option>
                <option value="la-yuslih">لا يصلح</option>
                <option value="waiting-parts">بانتظار قطع غيار</option>
                <option value="cancelled">تم الإلغاء</option>
              </select>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="delivered"
                  checked={form.delivered}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">تم التسليم</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="paid"
                  checked={form.paid}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">تم التسديد</span>
              </label>
            </div>
            {form.delivered && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التسليم</label>
                <input
                  type="date"
                  name="delivery_date"
                  value={form.delivery_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceEditModal; 