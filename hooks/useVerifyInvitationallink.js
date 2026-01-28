import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { acceptInvitation } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


const useVerifyInvitationallink = ({ groupId, token }) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const {
        mutate: verifyInvite,
        isPending: verificationLoading,
    } = useMutation({
        queryKey: ["verificationLink", groupId, token],
        mutationFn: () => acceptInvitation(groupId, token),
        enabled: !!groupId && !!token,
        onSuccess: () => {
            toast.success("Invitation link verified successfully");
            queryClient.invalidateQueries({ queryKey: ["groups"] });
            router.push(`/group/${groupId}`);
        },
        onError: (error) => {
            console.log(error)
            toast.error(error?.response?.data?.message || "Failed to verify invitation link");
            router.push(`/dashboard`);
        },

    });

    return {
        verifyInvite,
        verificationLoading,
    };
};

export default useVerifyInvitationallink;
