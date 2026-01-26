import React from "react";
import { createGroup } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const useCreateGroup = (setIsOpen) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { mutate: groupCreationMutation, isPending } = useMutation({
        mutationFn: createGroup,
        onSuccess: (data) => {
            toast.success("Group created successfully");
            router.push(`/group/${data._id}`);
            setIsOpen(false);
            queryClient.invalidateQueries(["groups"]);
        },
        onError: (error) => {
            toast.error(error.response.data.message);
        },
    });
    return { groupCreationMutation, isPending };
};

export default useCreateGroup;