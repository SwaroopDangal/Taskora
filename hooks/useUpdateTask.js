import { updateTask } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import toast from 'react-hot-toast';

const useUpdateTask = (setIsOpen) => {
    const queryClient = useQueryClient();
    const { mutate: taskUpdateMutation, isPending } = useMutation({
        mutationFn: updateTask,
        onSuccess: (data) => {
            toast.success("Task updated successfully");
            queryClient.invalidateQueries(['tasks', data.group, data.project]);
            setIsOpen(false);
        },
        onError: (error) => {
            toast.error(error.response.data.message);
        },
    });
    return { taskUpdateMutation, isPending };
}

export default useUpdateTask