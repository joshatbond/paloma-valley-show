import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'

export function ShowLoader() {
  const [isLoading, isLoadingAssign] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      isLoadingAssign(false)
    }, 1000)
  }, [])

  return (
    <div>
      <Link to='/show'>
        <Button className={`w-full ${isLoading && 'bg-[#9c9c9c]'}`}>
          {isLoading ? 'Loading...' : 'View the Show'}
        </Button>
      </Link>
    </div>
  )
}
