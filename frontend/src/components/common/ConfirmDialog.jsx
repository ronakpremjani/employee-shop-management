import React from 'react';
import Dialog from './Dialog';
import Spinner from './Spinner';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  variant = 'primary', // 'primary' | 'danger'
}) => {
  const isDanger = variant === 'danger';

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
        
        <div className="flex items-center justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-400 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-xl transition-all shadow-lg ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/20'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20'
            } disabled:opacity-50`}
          >
            {isLoading ? <Spinner size="sm" className="mr-2" /> : null}
            {confirmText}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
