import React from "react";
import { deleteGroup } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


const useDeleteGroup = (groupId) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { mutate: deleteGroupMutation, isPending: isDeleteGroupPending } = useMutation({
        mutationKey: ["delete-group", groupId],
        mutationFn: () => deleteGroup(groupId),
        onSuccess: (data) => {
            toast.success(data?.message || "Group deleted successfully");
            queryClient.invalidateQueries({
                queryKey: ["groups"],
            });
            router.push(`/dashboard`);
        },
        onError: (error) => toast.error(error.response.data.message),
    });
    return { deleteGroupMutation, isDeleteGroupPending };
};

export default useDeleteGroup;