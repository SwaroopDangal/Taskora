import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import UpdateTaskModal from "./UpdateTaskModal";
import DeleteTaskModal from "./DeleteTaskModal";

const TaskActions = ({ taskId, groupId, projectId }) => {
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&display=swap');
        
        .task-actions-container {
          font-family: 'Manrope', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .task-actions-button {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .task-actions-button:hover {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        }
        
        .task-actions-dropdown {
          opacity: 0;
          transform: translateY(-8px);
          animation: dropdownFadeIn 0.2s ease-out forwards;
        }
        
        @keyframes dropdownFadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .task-actions-dropdown-item {
          transition: all 0.15s ease;
          position: relative;
        }
        
        .task-actions-dropdown-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: currentColor;
          transform: scaleY(0);
          transition: transform 0.2s ease;
        }
        
        .task-actions-dropdown-item:hover::before {
          transform: scaleY(1);
        }
        
        .task-actions-dropdown-item:hover {
          padding-left: 18px;
        }
        
        .task-actions-icon {
          transition: transform 0.2s ease;
        }
        
        .task-actions-button:hover .task-actions-icon {
          transform: scale(1.1);
        }
      `}</style>

      <div className="task-actions-container relative">
        {/* 3-dot button */}
        <button
          ref={buttonRef}
          onClick={() => setOpen(!open)}
          className="task-actions-button w-9 h-9  rounded-xl bg-white border border-slate-200 hover:border-emerald-300 flex items-center justify-center shadow-sm hover:shadow transition-all"
          aria-label="Task actions"
          aria-expanded={open}
        >
          <MoreHorizontal
            className="task-actions-icon w-5 h-5 text-slate-500"
            strokeWidth={2}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div
            ref={dropdownRef}
            className="task-actions-dropdown absolute right-full top-1 -translate-y-1/2 mr-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50"
          >
            <div className="py-1">
              <button
                onClick={() => {
                  setUpdateOpen(true);
                  setOpen(false);
                }}
                className="task-actions-dropdown-item w-full px-4 py-2.5 flex items-center gap-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-50/50 hover:text-emerald-700"
              >
                <Edit className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                <span>Update Task</span>
              </button>

              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent my-1"></div>

              <button
                onClick={() => {
                  setDeleteOpen(true);
                  setOpen(false);
                }}
                className="task-actions-dropdown-item w-full px-4 py-2.5 flex items-center gap-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-50/50 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                <span>Delete Task</span>
              </button>
            </div>
          </div>
        )}

        {/* Update Modal */}
        {updateOpen && (
          <UpdateTaskModal
            isOpen={updateOpen}
            setIsOpen={setUpdateOpen}
            taskId={taskId}
            groupId={groupId}
            projectId={projectId}
          />
        )}

        {/* Delete Modal */}
        {deleteOpen && (
          <DeleteTaskModal
            isOpen={deleteOpen}
            setIsOpen={setDeleteOpen}
            taskId={taskId}
            groupId={groupId}
            projectId={projectId}
          />
        )}
      </div>
    </>
  );
};

export default TaskActions;
