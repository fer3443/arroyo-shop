import { Sizes } from "@/interfaces"
import clsx from "clsx";

interface Props {
  selectedSize?: Sizes;
  availableSizes: Sizes[];

  onSizeChanged: (size:Sizes) => void;
}
export const SizeSelector = ({availableSizes,selectedSize, onSizeChanged}:Props) => {
  return (
    <div className="my-4">
      <h3 className="font-bold mb-4">Tallas disponibles</h3>
      <div className="flex">
        {
          availableSizes.map(size => (
            <button 
            key={size}
            onClick={() => onSizeChanged(size)} 
            className={clsx("mx-2 hover:underline text-md",
              {'underline':size === selectedSize}
            )}>{size}</button>
          ))
        }
      </div>
    </div>
  )
}
