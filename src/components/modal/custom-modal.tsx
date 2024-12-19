import React from "react";

interface CustomModalProps {
  isVisible: boolean;
  message: string;
  confirmButton: string;
  cancelButton: string;
  onClose: () => void;
  onConfirm: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  message,
  confirmButton,
  cancelButton,
  onClose,
  onConfirm,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-lg font-semibold">{message}</h2>
        <div className="flex items-center justify-center">
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              {cancelButton}
            </button>
            <button
              onClick={onConfirm}
              className="bg-primary text-white px-4 py-2 rounded"
            >
              {confirmButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
