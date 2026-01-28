"use client";

import useVerifyInvitationallink from "@/hooks/useVerifyInvitationallink";
import { Link2, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Verification = () => {
  const { groupId, token } = useParams();
  const { verifyInvite, verificationLoading } = useVerifyInvitationallink({
    groupId,
    token,
  });

  useEffect(() => {
    if (token) verifyInvite();
  }, [token, verifyInvite]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          <Link2 className="w-6 h-6 text-emerald-600 absolute inset-0 m-auto" />
        </div>

        <h2 className="text-xl font-semibold text-gray-800">
          Verifying Invitation
        </h2>

        <p className="text-sm text-gray-500 text-center max-w-xs">
          Please wait while we verify your invitation link.
        </p>
      </div>
    </div>
  );
};

export default Verification;
