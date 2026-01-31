import useDeleteTask from "@/hooks/useDeleteTask";
import { Trash2, X, AlertTriangle } from "lucide-react";
import React, { useState } from "react";

const DeleteTaskModal = ({ isOpen, setIsOpen, taskId, groupId, projectId }) => {
  const { deleteTaskMutation, isPending } = useDeleteTask(
    groupId,
    projectId,
    taskId,
  );
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleDeleteTask = () => {
    if (deleteConfirmText === "confirm") {
      deleteTaskMutation();
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setDeleteConfirmText("");
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        
        @keyframes modalBackdropFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes warningGlow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(239, 68, 68, 0.1);
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .delete-modal-backdrop {
          animation: modalBackdropFade 0.2s ease-out;
        }
        
        .delete-modal-content {
          animation: modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .delete-modal-icon {
          animation: iconPulse 2s ease-in-out infinite;
        }
        
        .delete-modal-warning {
          animation: warningGlow 2s ease-in-out infinite;
        }
        
        .delete-modal-input:focus {
          outline: none;
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .delete-modal-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .delete-modal-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .delete-modal-button:hover::before {
          width: 300px;
          height: 300px;
        }
        
        .delete-modal-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }
        
        .delete-modal-button:active {
          transform: translateY(0);
        }
        
        .delete-modal-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
          transform: none !important;
        }
        
        .delete-modal-button:disabled::before {
          display: none;
        }
        
        .cancel-button {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          color: #334155;
          border: 2px solid #e2e8f0;
        }
        
        .cancel-button:hover {
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-color: #cbd5e1;
        }
        
        .delete-button {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: 2px solid #dc2626;
        }
        
        .delete-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          border-color: #b91c1c;
        }
        
        .loading-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .close-button {
          transition: all 0.2s ease;
          border-radius: 9999px;
          background: transparent;
          color: #64748b;
        }

        .close-button:hover {
          background: #fee2e2;
          color: #dc2626;
          transform: rotate(90deg);
        }

        .mono-text {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
        }
      `}</style>

      <div className="delete-modal-backdrop fixed inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/60 to-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="delete-modal-content bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Decorative Top Border */}
          <div className="h-1.5 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>

          {/* Modal Header */}
          <div className="relative p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="delete-modal-icon relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center border-2 border-red-200">
                    <Trash2
                      className="w-7 h-7 text-red-600"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Delete Task
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Permanent removal
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="close-button p-2"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="px-6 pb-6">
            {/* Warning Box */}
            <div className="delete-modal-warning relative overflow-hidden bg-gradient-to-br from-red-50 via-orange-50 to-red-50 border-2 border-red-200 rounded-2xl p-5 mb-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-200/30 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle
                      className="w-4 h-4 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <p className="text-red-900 font-semibold text-base leading-tight">
                      Warning: This action cannot be undone
                    </p>
                  </div>
                </div>
                <p className="text-red-800/90 text-sm leading-relaxed ml-9">
                  Deleting this task will permanently remove it from your
                  project along with all associated data and history.
                </p>
              </div>
            </div>

            {/* Confirmation Instructions */}
            <div className="mb-4">
              <p className="text-slate-700 text-sm leading-relaxed">
                To confirm this action, type{" "}
                <span className="mono-text inline-block px-2 py-0.5 bg-slate-100 text-red-600 rounded-md border border-slate-200 font-semibold">
                  confirm
                </span>{" "}
                below:
              </p>
            </div>

            {/* Confirmation Input */}
            <div className="relative">
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder='Type "confirm" to proceed'
                className="delete-modal-input w-full px-4 py-3.5 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 transition-all duration-200 text-sm"
                autoComplete="off"
                autoFocus
              />
              {deleteConfirmText === "confirm" && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex gap-3 p-6 pt-4 bg-gradient-to-b from-slate-50/50 to-slate-50 border-t border-slate-100">
            <button
              onClick={handleClose}
              className="delete-modal-button cancel-button flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteTask}
              disabled={deleteConfirmText !== "confirm" || isPending}
              className="delete-modal-button delete-button flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200"
            >
              {isPending ? (
                <>
                  <div className="loading-shimmer absolute inset-0 rounded-xl"></div>
                  <span className="relative">Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                  <span>Delete Permanently</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteTaskModal;
