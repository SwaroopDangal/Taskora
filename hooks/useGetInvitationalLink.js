import { getInvitationLink } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const useGetInvitationalLink = (groupId) => {
    const { data: invitationLink, isLoading } = useQuery({
        queryKey: ['invitationLink'],
        queryFn: () => getInvitationLink(groupId),

    })
    return { invitationLink, isLoading }
}

export default useGetInvitationalLink