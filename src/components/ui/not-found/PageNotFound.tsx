import { titleFont } from "@/config/fonts"
import Image from "next/image"
import Link from "next/link"

export const PageNotFound = () => {
	return (
		<div className="flex flex-col-reverse md:flex-row h-[700px] justify-center items-center align-middle">
			<div className="text-center px-5 mx-5">
				<h2 className={`${titleFont.className} antialaised text-9xl`}>404</h2>
				<p className="text-xl font-semibold">Ups! Lo sentimos mucho</p>
				<p className="font-light">
					<span>Puedes regresar a </span>
					<Link href='/' className="font-normal hover:underline transition-all">home</Link>
				</p>
			</div>
			<div>
				<Image
				priority
				 src='/imgs/starman_750x750.png'
				 alt="startman"
				 width={550}
				 height={550}
				 className="p-5 sm:p-0"
				/>
			</div>
		</div>
	)
}
