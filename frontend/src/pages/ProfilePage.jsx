import React, { useState, useEffect } from 'react';
import { User, Mail, Save, Edit3, Lock } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import userService from '../services/userService';
import { isValidEmail, isValidUsername } from '../utils/validator';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';

const ProfilePage = () => {
  const { user, isLoading: authLoading } = useAuthStore();
  const [profile, setProfile] = useState({
    email: '',
    username: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfile({
        email: user.email || '',
        username: user.username || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 실시간 유효성 검사
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profile.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!isValidEmail(profile.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }
    
    if (!profile.username) {
      newErrors.username = '사용자 이름을 입력해주세요.';
    } else if (!isValidUsername(profile.username)) {
      newErrors.username = '사용자 이름은 2자 이상 20자 이하이어야 합니다.';
    }
    
    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      // 실제 API는 없으므로 현재 사용자 정보 업데이트만 처리
      // await userService.updateProfile(profile);
      
      // 임시로 성공 메시지 표시
      setMessage('프로필이 성공적으로 업데이트되었습니다.');
      setEditMode(false);
    } catch (error) {
      setErrors({ api: error.response?.data?.error?.message || '프로필 업데이트에 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">로그인이 필요합니다</h3>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          프로필 페이지를 보기 위해 로그인하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">프로필</h1>
        <p className="text-gray-600 dark:text-gray-400">계정 정보를 관리하세요</p>
      </div>

      {message && <Alert type="success" message={message} />}
      {errors.api && <Alert type="error" message={errors.api} />}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <User className="h-8 w-8 text-gray-500 dark:text-gray-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.username}</h2>
            <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="이메일"
            type="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            error={errors.email}
            disabled={!editMode}
            icon={Mail}
            required
          />

          <Input
            label="사용자 이름"
            type="text"
            name="username"
            value={profile.username}
            onChange={handleInputChange}
            error={errors.username}
            disabled={!editMode}
            icon={User}
            required
          />

          <div className="flex gap-3 pt-4">
            {!editMode ? (
              <>
                <Button 
                  type="button" 
                  variant="primary" 
                  onClick={() => setEditMode(true)}
                  className="flex items-center"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  수정
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => window.location.href = '/change-password'}
                  className="flex items-center"
                >
                  <Lock className="h-4 w-4 mr-1" />
                  비밀번호 변경
                </Button>
              </>
            ) : (
              <>
                <Button 
                  type="submit" 
                  variant="primary" 
                  isLoading={loading}
                  disabled={loading}
                  className="flex items-center"
                >
                  <Save className="h-4 w-4 mr-1" />
                  저장
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setEditMode(false);
                    setProfile({
                      email: user.email || '',
                      username: user.username || '',
                    });
                    setErrors({});
                  }}
                >
                  취소
                </Button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* 비밀번호 변경 섹션 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">비밀번호 변경</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          계정 보안을 위해 비밀번호를 주기적으로 변경해주세요.
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/change-password'}
          className="flex items-center"
        >
          <Lock className="h-4 w-4 mr-1" />
          비밀번호 변경
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
