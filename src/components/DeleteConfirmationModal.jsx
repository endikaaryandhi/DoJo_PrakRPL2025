// src/components/DeleteConfirmationModal.jsx
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-4 w-80">
          <h2 className="text-lg font-semibold text-gray-800">Konfirmasi Hapus</h2>
          <p className="text-sm text-gray-600">Apakah kamu yakin ingin menghapus todo ini?</p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={onConfirm}
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteConfirmationModal;
  