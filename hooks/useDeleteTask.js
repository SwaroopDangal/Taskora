import React from "react";
import { deleteTask } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


const useDeleteTask = (groupId, projectId, taskId) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { mutate: deleteTaskMutation, isPending: isDeleteTaskPending } = useMutation({
        mutationKey: ["delete-task", groupId, projectId, taskId],
        mutationFn: () => deleteTask(groupId, projectId, taskId),
        onSuccess: (data) => {
            toast.success(data?.message || "Task deleted successfully");
            queryClient.invalidateQueries({
                queryKey: ["tasks", groupId, projectId],
            });
            router.refresh();
        },
        onError: (error) => toast.error(error.response.data.message),
    });
    return { deleteTaskMutation, isDeleteTaskPending };
};

export default useDeleteTask;