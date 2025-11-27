import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Filter } from 'lucide-react';
import useHolidayStore from '../stores/holidayStore';
import useUiStore from '../stores/uiStore';
import { formatDateKorean } from '../utils/dateFormatter';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const HolidayPage = () => {
  const { 
    holidays, 
    isLoading, 
    error,
    fetchHolidays 
  } = useHolidayStore();
  
  const { openModal } = useUiStore();
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchHolidays(selectedYear, selectedMonth);
  }, [fetchHolidays, selectedYear, selectedMonth]);

  const handleAddHoliday = () => {
    openModal('holiday-add');
  };

  // 연도와 월 선택 옵션 생성
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">국경일</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {selectedYear}년 {selectedMonth}월
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}년</option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}월</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && <Alert type="error" message={error} />}

      {/* 국경일 목록 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : holidays.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 text-gray-400">
            <Calendar className="h-full w-full" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">국경일이 없습니다</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {selectedYear}년 {selectedMonth}월에는 등록된 국경일이 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {holidays.map((holiday) => (
            <div 
              key={holiday.holidayId} 
              className="border rounded-lg p-4 bg-white dark:bg-gray-800 dark:border-gray-700 border-gray-200"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center dark:bg-red-900/30">
                  <Calendar className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-red-600 dark:text-red-400">
                    {holiday.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {formatDateKorean(holiday.date)}
                  </p>
                  
                  {holiday.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {holiday.description}
                    </p>
                  )}
                  
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                      {holiday.isRecurring ? '반복' : '비반복'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HolidayPage;
