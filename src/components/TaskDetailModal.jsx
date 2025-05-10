import React from 'react';
import { Dialog } from '@headlessui/react';

const TaskDetailModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <Dialog
      open={!!task}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <Dialog.Panel className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-xl transform transition-all">
        <Dialog.Title className="text-2xl font-semibold text-indigo-600 mb-4 border-b pb-2">
          📋 Todo Detail
        </Dialog.Title>

        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <p className="text-gray-500">Todo</p>
            <p className="font-medium">{task.title}</p>
          </div>
          <div>
            <p className="text-gray-500">Description</p>
            <p className="whitespace-pre-wrap break-words">{task.description || '-'}</p>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Category</p>
              <p className="font-medium">{task.category?.name || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">Priority</p>
              <p className="font-medium">{task.priority || '-'}</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Deadline Date</p>
              <p className="font-medium">{task.due_date || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium"> {task.status === 'pending' || task.status === 'in progress' ? 'In Progress' : task.status}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-500">Deadline Time</p>
            <p className="font-medium">{task.due_time || '-'}</p>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium text-sm rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default TaskDetailModal;
