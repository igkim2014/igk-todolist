// 할일 상태 상수
export const TODO_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  DELETED: 'deleted',
};

export const TODO_STATUS_LABELS = {
  [TODO_STATUS.ACTIVE]: '진행 중',
  [TODO_STATUS.COMPLETED]: '완료',
  [TODO_STATUS.DELETED]: '삭제됨',
};

export const TODO_STATUS_COLORS = {
  [TODO_STATUS.ACTIVE]: 'orange',
  [TODO_STATUS.COMPLETED]: 'green',
  [TODO_STATUS.DELETED]: 'gray',
};
