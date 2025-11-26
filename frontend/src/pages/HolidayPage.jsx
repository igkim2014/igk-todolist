import React, { useEffect, useState } from 'react';
import useHolidayStore from '../stores/holidayStore';
import useAuthStore from '../stores/authStore';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';

function HolidayPage() {
  const { holidays, loading, error, fetchHolidays, createHoliday, updateHoliday } = useHolidayStore();
  const { user, isAuthenticated } = useAuthStore();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHoliday, setCurrentHoliday] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(true);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (isAuthenticated) {
      fetchHolidays(year, month);
    }
  }, [isAuthenticated, fetchHolidays, year, month]);

  const handleYearChange = (e) => setYear(parseInt(e.target.value));
  const handleMonthChange = (e) => setMonth(parseInt(e.target.value));

  const openCreateModal = () => {
    setCurrentHoliday(null);
    setTitle('');
    setDate('');
    setDescription('');
    setIsRecurring(true);
    setIsModalOpen(true);
  };

  const openEditModal = (holiday) => {
    setCurrentHoliday(holiday);
    setTitle(holiday.title);
    setDate(new Date(holiday.date).toISOString().split('T')[0]);
    setDescription(holiday.description || '');
    setIsRecurring(holiday.isRecurring);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const holidayData = { title, date, description, isRecurring };
    
    try {
      if (currentHoliday) {
        await updateHoliday(currentHoliday.holidayId, holidayData);
      } else {
        await createHoliday(holidayData);
      }
      setIsModalOpen(false);
      fetchHolidays(year, month); // Refresh list
    } catch (err) {
      alert(err.message || 'Failed to save holiday');
    }
  };

  if (loading && !holidays.length) return <div className="text-center p-8">Loading holidays...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Holidays 📅</h2>
        {isAdmin && (
          <Button onClick={openCreateModal} variant="primary">
            + Add Holiday
          </Button>
        )}
      </div>

      <div className="flex space-x-4 mb-6">
        <select
          value={year}
          onChange={handleYearChange}
          className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <select
          value={month}
          onChange={handleMonthChange}
          className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {holidays.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No holidays found for this period.</p>
        ) : (
          holidays.map((holiday) => (
            <div key={holiday.holidayId} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-red-500">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{holiday.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {new Date(holiday.date).toLocaleDateString()}
                  </p>
                  {holiday.description && <p className="text-sm text-gray-500 mt-2">{holiday.description}</p>}
                  {holiday.isRecurring && <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">Recurring</span>}
                </div>
                {isAdmin && (
                  <Button size="sm" variant="secondary" onClick={() => openEditModal(holiday)}>
                    Edit
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal (Admin Only) */}
      {isAdmin && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={currentHoliday ? 'Edit Holiday' : 'Add Holiday'}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="mb-4">
              <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="mb-4">
              <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="isRecurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="isRecurring" className="text-gray-700 dark:text-gray-300">Recurring yearly</label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Save</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default HolidayPage;
