let toastRef = null;

export const setToastRef = (ref) => {
  toastRef = ref;
};

const toast = {
  success: (message, title = 'Success') => {
    if (toastRef) {
      toastRef.show({ severity: 'success', summary: title, detail: message, life: 4000 });
    } else {
      console.log('Success:', message);
    }
  },
  error: (message, title = 'Error') => {
    if (toastRef) {
      toastRef.show({ severity: 'error', summary: title, detail: message, life: 4000 });
    } else {
      console.error('Error:', message);
    }
  },
  warn: (message, title = 'Warning') => {
    if (toastRef) {
      toastRef.show({ severity: 'warn', summary: title, detail: message, life: 4000 });
    } else {
      console.warn('Warning:', message);
    }
  },
  info: (message, title = 'Info') => {
    if (toastRef) {
      toastRef.show({ severity: 'info', summary: title, detail: message, life: 4000 });
    } else {
      console.log('Info:', message);
    }
  }
};

export default toast;
