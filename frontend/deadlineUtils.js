export const getDeadlineStatus = (deadline) => {
  if (!deadline) return { status: 'no-deadline', color: '#999', label: 'Sem prazo' };
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { status: 'overdue', color: '#e74c3c', label: '⚠️ ATRASADA' };
  else if (diffDays === 0) return { status: 'today', color: '#f39c12', label: '⏰ HOJE' };
  else if (diffDays === 1) return { status: 'tomorrow', color: '#f39c12', label: '⏰ AMANHÃ' };
  else if (diffDays <= 3) return { status: 'soon', color: '#f39c12', label: `📅 ${diffDays}d` };
  else return { status: 'on-time', color: '#27ae60', label: `📅 ${diffDays}d` };
};
