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
      <div className="space-y-4 font-sans">
        <p className="text-zinc-400 text-xs leading-relaxed">{message}</p>
        
        <div className="flex items-center justify-end space-x-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-3.5 py-2 text-xs font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center justify-center px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shadow-sm cursor-pointer ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-orange-600 hover:bg-orange-500 text-white'
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

