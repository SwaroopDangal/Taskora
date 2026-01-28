import { getProjects } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const useGetProjects = (groupId) => {
    const { data: projectsData, isLoading } = useQuery({
        queryKey: ['projects', groupId],
        queryFn: () => getProjects(groupId),

    })
    return ({ projectsData, isLoading })

}

export default useGetProjects