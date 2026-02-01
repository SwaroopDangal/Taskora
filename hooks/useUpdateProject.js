import { updateGroup, updateProject } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import toast from 'react-hot-toast';

const useUpdateProject = (setIsOpen) => {
    const queryClient = useQueryClient();
    const { mutate: projectUpdateMutation, isPending: updatePending } = useMutation({
        mutationFn: updateProject,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['projects', data.group]);
            setIsOpen(false)
            toast.success("Project updated successfully");

        },
        onError: (error) => {
            toast.error(error.response.data.message);
        },
    });
    return { projectUpdateMutation, updatePending };
}

export default useUpdateProject