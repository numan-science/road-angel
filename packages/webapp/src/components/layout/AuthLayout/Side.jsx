import React, { cloneElement } from 'react'
// import { Avatar } from "@/components/ui";
import Logo from '@/components/template/Logo'
import { APP_NAME } from '@/constants/app.constant'
import LanguageSelector from '@/components/template/LanguageSelector'

const Side = ({ children, content, ...rest }) => {
  return (
    <div className="grid lg:grid-cols-3 h-full">
      <div
        className="bg-no-repeat bg-cover py-6 px-16 flex-col justify-between hidden lg:flex"
        style={{ backgroundImage: `url('/img/others/image-side.png')` }}
      >
        <Logo mode="dark" style={{ height: 80, display: 'flex' }} />
        {/* <div>
          <div className="mb-6 flex items-center gap-4">
            <Avatar
              className="border-2 border-white"
              shape="circle"
              src="/img/avatars/thumb-10.jpg"
            />
            <div className="text-white">
              <div className="font-semibold text-base">Brittany Hale</div>
              <span className="opacity-80">CTO, Onward</span>
            </div>
          </div>
          <p className="text-lg text-white opacity-80">
            Elstar comes with a complete set of UI components crafted with
            Tailwind CSS, it fulfilled most of the use case to create modern and
            beautiful UI and application
          </p>
        </div> */}
        <span className="text-white">
          Copyright &copy; {`${new Date().getFullYear()}`}{' '}
          <span className="font-semibold">{`${APP_NAME}`}</span>{' '}
        </span>
      </div>
      <div className="col-span-2 flex flex-col items-center bg-white dark:bg-gray-800">
       <div className='flex justify-end items-end w-full p-3 mb-8'><LanguageSelector/></div> 
        <div className="xl:min-w-[450px] px-8 py-8">
          <div className="mb-8">{content}</div>
          {children ? cloneElement(children, { ...rest }) : null}
        </div>
      </div>
     
    </div>
  )
}
export default Side