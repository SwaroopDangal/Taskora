import { updateGroup } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import toast from 'react-hot-toast';

const useUpdateGroup = () => {
    const queryClient = useQueryClient();
    const { mutate: groupUpdateMutation, isPending: updatePending } = useMutation({
        mutationFn: updateGroup,
        onSuccess: (data) => {
            toast.success("Group updated successfully");
            queryClient.invalidateQueries(['group', data._id]);
        },
        onError: (error) => {
            toast.error(error.response.data.message);
        },
    });
    return { groupUpdateMutation, updatePending };
}

export default useUpdateGroup