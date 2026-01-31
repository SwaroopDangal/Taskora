import { getTaskById } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const 
useGetTaskById = (groupId, projectId, taskId) => {
    const { data: taskByIdData, isLoading } = useQuery({
        queryKey: ["task", groupId, projectId, taskId],
        queryFn: () => getTaskById(groupId, projectId, taskId),
    })
    return ({ taskByIdData, isLoading })
}

export default useGetTaskById