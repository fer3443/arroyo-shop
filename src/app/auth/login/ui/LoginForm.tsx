"use client";

import { authenticate } from "@/actions";
import clsx from "clsx";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useActionState, useEffect } from 'react';
import { IoInformationOutline } from "react-icons/io5";

export const LoginForm = () => {
  // const router = useRouter();
  const [errorMessage, formAction] = useActionState(
    authenticate,
    undefined
  );

  useEffect(() => {
    if(errorMessage === "Success"){
      // router.replace('/')
      window.location.replace('/')
      console.log('ejecutado el useEffect')
    }
  }, [errorMessage])
    
    
  return (
    <form action={formAction} className="flex flex-col">
      <label htmlFor="email">Correo electrónico</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="email"
        name="email"
      />

      <label htmlFor="password">Contraseña</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="password"
        name="password"
      />

      {errorMessage && (
        <div className="flex flex-row gap-2 mb-2">
          <IoInformationOutline className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-500">{errorMessage}</p>
        </div>
      )}

     <LoginButton/>

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/new-account" className="btn-secondary text-center">
        Crear una nueva cuenta
      </Link>
    </form>
  );
};

function LoginButton() {
  const response = useActionState( authenticate,
    undefined)
  return (
    <button
      type="submit"
      className={clsx({
        "btn-primary": !response[2],
        "btn-disabled": response[2],
      })}
      disabled={response[2]}
    >
      Ingresar
    </button>
  );
}
