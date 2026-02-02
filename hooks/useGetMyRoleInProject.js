import { getMyRoleInProject } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const useGetMyRoleInProject = (groupId, projectId) => {
    const { data: myRoleInProject, isLoading: roleLoading } = useQuery({
        queryKey: ["my-role-in-project", groupId, projectId],
        queryFn: () => getMyRoleInProject(groupId, projectId),
    })
    return { myRoleInProject, roleLoading }
}

export default useGetMyRoleInProject