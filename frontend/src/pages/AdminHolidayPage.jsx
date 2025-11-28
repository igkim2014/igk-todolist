/**/
import React, { useEffect, useState } from "react";
import { Calendar, Plus, Edit3, Trash2, Save, X } from "lucide-react";
import useHolidayStore from "../stores/holidayStore";
import { formatDate, formatDateKorean } from "../utils/dateFormatter";
import { isValidDate } from "../utils/validator";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Alert from "../components/common/Alert";

const AdminHolidayPage = () => {
  const {
    holidays,
    isLoading,
    error,
    fetchHolidays,
    createHoliday,
    updateHoliday,
    deleteHoliday,
  } = useHolidayStore();

  const [holidaysData, setHolidaysData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    date: "",
    description: "",
    isRecurring: true,
  });
  const [addForm, setAddForm] = useState({
    title: "",
    date: "",
    description: "",
    isRecurring: true,
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchHolidays();
  }, [fetchHolidays]);

  useEffect(() => {
    setHolidaysData(holidays);
  }, [holidays]);

  const handleEditClick = (holiday) => {
    setEditingId(holiday.holidayId);
    setEditForm({
      title: holiday.title,
      date: formatDate(holiday.date), // Convert to YYYY-MM-DD format for input
      description: holiday.description || "",
      isRecurring: holiday.isRecurring,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      title: "",
      date: "",
      description: "",
      isRecurring: true,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(editForm);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await updateHoliday(editingId, editForm);
      setEditingId(null);
      setMessage("국경일이 성공적으로 수정되었습니다.");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    } catch (err) {
      setErrors({
        api:
          err.response?.data?.error?.message || "국경일 수정에 실패했습니다.",
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말로 이 국경일을 삭제하시겠습니까?")) {
      try {
        await deleteHoliday(id);
        setMessage("국경일이 성공적으로 삭제되었습니다.");
        setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
      } catch (err) {
        setErrors({
          api:
            err.response?.data?.error?.message || "국경일 삭제에 실패했습니다.",
        });
      }
    }
  };

  const handleAddChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(addForm);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createHoliday(addForm);
      setAddForm({
        title: "",
        date: "",
        description: "",
        isRecurring: true,
      });
      setShowAddForm(false);
      setMessage("국경일이 성공적으로 추가되었습니다.");
      setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
    } catch (err) {
      setErrors({
        api:
          err.response?.data?.error?.message || "국경일 추가에 실패했습니다.",
      });
    }
  };

  const validateForm = (form) => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "제목을 입력해주세요.";
    }

    if (!form.date) {
      newErrors.date = "날짜를 선택해주세요.";
    } else if (!isValidDate(form.date)) {
      newErrors.date = "올바른 날짜 형식이 아닙니다.";
    }

    return newErrors;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          국경일 관리
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          국경일 정보를 관리하세요 (관리자 전용)
        </p>
      </div>

      {message && <Alert type="success" message={message} />}
      {errors.api && <Alert type="error" message={errors.api} />}

      {/* 추가 버튼 */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => {
            setShowAddForm(true);
            setAddForm({
              title: "",
              date: "",
              description: "",
              isRecurring: true,
            });
          }}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          국경일 추가
        </Button>
      </div>

      {/* 추가 폼 */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            새 국경일 추가
          </h2>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="제목 *"
                type="text"
                name="title"
                value={addForm.title}
                onChange={handleAddChange}
                error={errors.title}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  날짜 *
                </label>
                <input
                  type="date"
                  name="date"
                  value={addForm.date}
                  onChange={handleAddChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.date ? "border-red-500" : "border-gray-300"
                  } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                설명
              </label>
              <textarea
                name="description"
                value={addForm.description}
                onChange={handleAddChange}
                rows={3}
                placeholder="국경일에 대한 설명을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRecurring"
                name="isRecurring"
                checked={addForm.isRecurring}
                onChange={handleAddChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isRecurring"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
                매년 반복
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                variant="primary"
                className="flex items-center"
              >
                <Save className="h-4 w-4 mr-1" />
                저장
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setErrors({});
                }}
                className="flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                취소
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 국경일 목록 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : holidaysData.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 text-gray-400">
            <Calendar className="h-full w-full" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            등록된 국경일이 없습니다
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            위의 버튼을 클릭하여 국경일을 추가하세요.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  제목
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  날짜
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  설명
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  반복
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {holidaysData.map((holiday) => (
                <tr
                  key={holiday.holidayId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  {editingId === holiday.holidayId ? (
                    // 수정 모드
                    <td colSpan="5" className="px-6 py-4">
                      <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="제목 *"
                            type="text"
                            name="title"
                            value={editForm.title}
                            onChange={handleEditChange}
                            error={errors.title}
                            required
                          />

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              날짜 *
                            </label>
                            <input
                              type="date"
                              name="date"
                              value={editForm.date}
                              onChange={handleEditChange}
                              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                                errors.date
                                  ? "border-red-500"
                                  : "border-gray-300"
                              } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                            />
                            {errors.date && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.date}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            설명
                          </label>
                          <textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`editIsRecurring-${holiday.holidayId}`}
                            name="isRecurring"
                            checked={editForm.isRecurring}
                            onChange={handleEditChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`editIsRecurring-${holiday.holidayId}`}
                            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                          >
                            매년 반복
                          </label>
                        </div>

                        <div className="flex justify-end gap-3">
                          <Button
                            type="submit"
                            variant="primary"
                            className="flex items-center"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            저장
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="flex items-center"
                          >
                            <X className="h-4 w-4 mr-1" />
                            취소
                          </Button>
                        </div>
                      </form>
                    </td>
                  ) : (
                    // 일반 모드
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {holiday.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDateKorean(holiday.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                          {holiday.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            holiday.isRecurring
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {holiday.isRecurring ? "반복" : "비반복"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(holiday)}
                            className="flex items-center"
                          >
                            <Edit3 className="h-4 w-4 mr-1" />
                            수정
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(holiday.holidayId)}
                            className="flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            삭제
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminHolidayPage;
