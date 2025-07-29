export function formatRelativeTime(date: string | Date): string {
  const targetDate = new Date(date);
  const now = new Date();
  const diffInMs = targetDate.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'today';
  } else if (diffInDays === 1) {
    return 'tomorrow';
  } else if (diffInDays > 1 && diffInDays <= 7) {
    return `in ${diffInDays} days`;
  } else if (diffInDays > 7) {
    const weeks = Math.floor(diffInDays / 7);
    if (weeks === 1) {
      return 'in 1 week';
    } else {
      return `in ${weeks} weeks`;
    }
  } else {
    return 'past';
  }
}