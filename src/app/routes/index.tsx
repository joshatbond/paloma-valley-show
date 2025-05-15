import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className='min-h-screen bg-[#121212] text-[#eaeaea]'>Hello World</div>
  )
}
