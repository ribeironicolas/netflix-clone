import axios from 'axios'
import React, { useCallback, useMemo } from 'react'
import { AiOutlinePlus, AiOutlineCheck } from 'react-icons/ai'

import useCurrentUser from '@/hooks/useCurrentUser'
import useFavorites from '@/hooks/useFavorites'

interface FavoriteBottonProps {
  movieId: string
}

const FavoriteButton: React.FC<FavoriteBottonProps> = ({ movieId }) => {
  const { mutate: mutateFavorites } = useFavorites()
  const { data: currentUser, mutate } = useCurrentUser()

  const isFavorite = useMemo(() => {
    const list = currentUser?.favoriteIds || []

    return list.includes(movieId)
  }, [currentUser?.favoriteIds, movieId])

  const toggleFavorites = useCallback(async () => {
    let response

    if (isFavorite) {
      response = await axios.delete('/api/favorite', { data: { movieId } })
    } else {
      response = await axios.post('/api/favorite', { movieId })
    }

    const updatedFavoritesIds = response?.data?.favoritesIds

    mutate({
      ...currentUser,
      favoriteIds: updatedFavoritesIds,
    })

    mutateFavorites()
  }, [currentUser, isFavorite, movieId, mutate, mutateFavorites])

  const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus
  console.log(movieId)
  return (
    <div
      onClick={toggleFavorites}
      className='cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300'
    >
      <Icon className='text-white' size={25} />
    </div>
  )
}

export default FavoriteButton
