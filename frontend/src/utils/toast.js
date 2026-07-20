import hotToast from 'react-hot-toast';

export const setToastRef = (ref) => {
  // Kept for backward compatibility if it's called anywhere, though it does nothing now.
};

const toast = {
  success: (message, title) => {
    // We can ignore title or format it, but react-hot-toast usually just takes a string or JSX
    hotToast.success(title ? `${title}: ${message}` : message);
  },
  error: (message, title) => {
    hotToast.error(title ? `${title}: ${message}` : message);
  },
  warn: (message, title) => {
    // react-hot-toast doesn't have a built-in warn, we can use a custom icon or just plain toast
    hotToast(title ? `${title}: ${message}` : message, {
      icon: '⚠️',
    });
  },
  info: (message, title) => {
    // plain toast for info
    hotToast(title ? `${title}: ${message}` : message, {
      icon: 'ℹ️',
    });
  }
};

export default toast;
