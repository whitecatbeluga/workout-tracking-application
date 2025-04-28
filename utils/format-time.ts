export const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  let formatted = "";

  if (hours > 0) {
    formatted += `${hours} h `;
  }
  if (minutes > 0 || hours > 0) {
    formatted += `${minutes} min `;
  }
  formatted += `${seconds} s`;
  return formatted.trim();
};
