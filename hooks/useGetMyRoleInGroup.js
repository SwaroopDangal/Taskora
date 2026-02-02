import { getMyRoleInGroup } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const useGetMyRoleInGroup = (groupId) => {
    const { data: myRoleInGroup, isLoading: roleLoading } = useQuery({
        queryKey: ["my-role-in-group", groupId],
        queryFn: () => getMyRoleInGroup(groupId),
    })
    return { myRoleInGroup, roleLoading }
}

export default useGetMyRoleInGroup