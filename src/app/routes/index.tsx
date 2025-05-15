import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className='h-screen font-poke grid grid-rows-[1fr_auto]'>
      <div className='bg-black grid place-items-center'>
        <div className='w-full aspect-[4/3]'>
          <div className='header bg-[#0078BF] text-white flex justify-end items-center gap-2 py-2'>
            <div className='rounded-full bg-white size-4 text-[10px] flex justify-center items-center pl-px text-[#0078BF] mb-1'>
              A
            </div>

            <span className='text-[12px]'>NEXT</span>
          </div>

          <div className='content bg-[#4F60B0] h-full p-2'>
            <div className='border-2 border-[#686868] bg-[#f0f9f8] h-full space-y-4 p-2 text-[12px] poke-shadow flex flex-col'>
              <div className='flex-grow'>
                <p>
                  In the world which you are about to enter, you will embark on
                  a grand adventure with you as the hero.
                </p>

                <p>
                  Speak to people and check things wherever you go, be it towns,
                  roads, or caves. Gather information and hints from every
                  source.
                </p>
              </div>

              <div className='flex justify-end '>
                <img
                  src='/images/arrow.png'
                  className='w-6 animate-bounce duration-[2s]'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=''>
        <img src='/images/controller.png' />
      </div>
    </div>
  )
}
