"use client";
import React, { useState } from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";
import useDeleteGroup from "../hooks/useDeleteGroup";
import useGetGroupById from "@/hooks/useGetGroupById";

const DeleteGroupModal = ({ setShowDeleteGroupModal, groupId }) => {
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const handleDeleteGroup = () => {
    if (deleteConfirmText === groupByIdData?.name) {
      deleteGroupMutation();
      setShowDeleteGroupModal(false);
    }
  };

  const { deleteGroupMutation, isDeleteGroupPending } = useDeleteGroup(groupId);
  const { groupByIdData } = useGetGroupById(groupId);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Delete Group
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  This action is permanent and cannot be undone
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowDeleteGroupModal(false);
                setDeleteConfirmText("");
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 pb-6">
          {/* Warning Box */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5">
            <p className="text-sm text-red-800 leading-relaxed">
              Deleting{"  "}
              <strong className="font-semibold text-xl">
                {groupByIdData?.name}
              </strong>
              {"  "}will permanently remove:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-red-700">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                All tasks and subtasks
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                Activity history and comments
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                Access for all {groupByIdData?.members?.length} member
                {groupByIdData?.members?.length !== 1 ? "s" : ""}
              </li>
            </ul>
          </div>

          {/* Confirmation Input Section */}
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Type{" "}
                <span className="font-semibold text-gray-900 text-xl">
                  {groupByIdData?.name}
                </span>
                {"  "}to confirm:
              </span>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Enter group name"
                className="mt-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                autoComplete="off"
              />
            </label>

            {deleteConfirmText && deleteConfirmText !== groupByIdData?.name && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                Group name does not match
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3">
          <button
            onClick={() => {
              setShowDeleteGroupModal(false);
              setDeleteConfirmText("");
            }}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteGroup}
            disabled={
              deleteConfirmText !== groupByIdData?.name || isDeleteGroupPending
            }
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            {isDeleteGroupPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Group
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteGroupModal;
