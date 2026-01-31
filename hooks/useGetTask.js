import { getGroups, getTasks } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const useGetTask = (groupId, projectId) => {
    const { data: taskData, isLoading: taskLoading, refetch } = useQuery({
        queryKey: ["tasks", groupId, projectId],
        queryFn: () => getTasks(groupId, projectId),
    })
    return { taskData, taskLoading, refetch }
}

export default useGetTask