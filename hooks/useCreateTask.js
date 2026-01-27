import { createTask } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import toast from 'react-hot-toast';

const useCreateTask = ({ setIsOpen, groupId }) => {
    const queryClient = useQueryClient();
    const { mutate: createTaskMutation, isPending } = useMutation({
        mutationFn: createTask,

        onSuccess: (data) => {
            toast.success("Task created successfully");

            queryClient.invalidateQueries({
                queryKey: ["group-projects", groupId],
            });

            queryClient.invalidateQueries({
                queryKey: ["group", groupId],
            });

            setIsOpen(false);
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.message || "Failed to create task"
            );
        },
    });

    return {
        createTaskMutation,
        isPending,
    };
}

export default useCreateTask