"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "./Loader";

export default function ProtectRoute({
    children,
    myRoleInGroup,
    isLoading = false,
}) {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded) return;

        if (!isSignedIn) {
            router.replace("/");
            return;
        }

        if (myRoleInGroup?.role === "guest") {
            router.replace("/dashboard");
        }
    }, [isLoaded, isSignedIn, myRoleInGroup, router]);

    if (!isLoaded || isLoading) {
        return <Loading />;
    }

    if (!isSignedIn) {
        return null;
    }

    if (myRoleInGroup?.role === "guest") {
        return null;
    }

    return <>{children}</>;
}
