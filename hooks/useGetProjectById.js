import { getProjectById } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const useGetProjectById = (groupId, projectId) => {
    const { data: projectByIdData, isLoading } = useQuery({
        queryKey: ["project"],
        queryFn: () => getProjectById(groupId, projectId),
    })
    return ({ projectByIdData, isLoading })
}

export default useGetProjectById