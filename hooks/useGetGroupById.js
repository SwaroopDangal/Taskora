import { getGroupById } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const useGetGroupById = (groupId) => {
    const { data: groupByIdData, isLoading } = useQuery({
        queryKey: ["group", groupId],
        queryFn: () => getGroupById(groupId),
    })
    return ({ groupByIdData, isLoading })
}

export default useGetGroupById