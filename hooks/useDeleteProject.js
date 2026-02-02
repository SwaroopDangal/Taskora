import React from "react";
import { deleteGroup, deleteProject } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


const useDeleteProject = (groupId, projectId) => {
    const queryClient = useQueryClient();
    const { mutate: deleteProjectMutation, isPending: isDeleteProjectPending } = useMutation({
        mutationKey: ["delete-group", groupId],
        mutationFn: () => deleteProject(groupId, projectId),
        onSuccess: (data) => {
            toast.success(data?.message || "Project deleted successfully");
            queryClient.invalidateQueries({
                queryKey: ["projects", groupId],
            });
            queryClient.invalidateQueries({
                queryKey: ["group", groupId],
            });
        },
        onError: (error) => toast.error(error.response.data.message),
    });
    return { deleteProjectMutation, isDeleteProjectPending };
};

export default useDeleteProject;