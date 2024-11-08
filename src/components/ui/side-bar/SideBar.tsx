"use client"

import { useUIStore } from "@/store";
import clsx from "clsx";
import Link from "next/link"
import { IoCloseOutline, IoLogInOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline, IoSearchOutline, IoShirtOutline, IoTicketOutline } from "react-icons/io5"

interface ItemsNav {
  href:string;
  icon:React.ReactNode;
  title:string;
}

export const SideBar = () => {

  const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen);
  const closeMenu = useUIStore(state => state.closeSideMenu);
  const itemsNav:ItemsNav[] = [
    {href:"/",icon:<IoPersonOutline size={30}/>,title:"Perfil" },
    {href:"/",icon:<IoTicketOutline size={30}/>,title:"Ordenes" },
    {href:"/",icon:<IoLogInOutline size={30}/>,title:"Ingresar"},
    {href:"/",icon:<IoLogOutOutline size={30}/>,title:"Salir"},
  ]

  const itemsNavAdmin:ItemsNav[] = [
    {href:"/",icon:<IoShirtOutline size={30}/>,title:"Productos" },
    {href:"/",icon:<IoTicketOutline size={30}/>,title:"Ordenes" },
    {href:"/",icon:<IoPeopleOutline size={30}/>,title:"Usuarios" },
  ]
  return (
    <div>
      {
        isSideMenuOpen && (
          <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"/>
        )
      }
      {
        isSideMenuOpen && (
          <div 
          onClick={closeMenu}
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"/>
        )
      }
      <nav 
      className={clsx("fixed p-5 right-0 top-0 w-[450px] h-screen bg-white z-20 shadow-xl transform transition-all duration-300",
        {
          "translate-x-full":!isSideMenuOpen
        }
      )}
      >
        <IoCloseOutline size={30} className="absolute top-5 right-5 cursor-pointer" onClick={() => closeMenu()}/>
          <div className="relative mt-14">
            <IoSearchOutline size={20} className="absolute top-2 left-2"/>
            <input type="text" 
            placeholder="Buscar"
            className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-md 2xl:text-xl border-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          {
            itemsNav.map(item => (
              <Link
              key={item.title}
              href={item.href}
              className="flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
              >
               {item.icon}
                <span className="ml-3 text-md 2xl:text-xl">{item.title}</span>
              </Link>
            ))
          }
          <div className="w-full h-px bg-gray-200 my-5 2xl:my-10"/>
          {
            itemsNavAdmin.map(item => (
              <Link
              key={item.title}
              href={item.href}
              className="flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
              >
               {item.icon}
                <span className="ml-3 text-md 2xl:text-xl">{item.title}</span>
              </Link>
            ))
          }
      </nav>
    </div>
  )
}
