"use client";

import { createProject } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const useCreateProject = ({ setIsOpen, groupId }) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate: createProjectMutation, isPending } = useMutation({
        mutationFn: createProject,

        onSuccess: (data) => {
            toast.success("Project created successfully");

            queryClient.invalidateQueries({
                queryKey: ["group-projects", groupId],
            });

            queryClient.invalidateQueries({
                queryKey: ["group", groupId],
            });

            setIsOpen(false);
            router.push(`/group/${groupId}/project/${data._id}`);
        },

        onError: (error) => {
            toast.error(
                error?.response?.data?.message || "Failed to create project"
            );
        },
    });

    return {
        createProjectMutation,
        isPending,
    };
};

export default useCreateProject;
