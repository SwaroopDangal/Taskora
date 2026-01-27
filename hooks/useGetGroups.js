import { getGroups } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

const useGetGroups = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["groups"],
        queryFn: getGroups,
    })
    return ({ data, isLoading })
}

export default useGetGroups