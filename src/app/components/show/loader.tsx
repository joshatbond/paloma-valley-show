import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export function ShowLoader() {
  const [isLoading, isLoadingAssign] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      isLoadingAssign(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Link to='/show'>View the show</Link>
    </div>
  )
}
