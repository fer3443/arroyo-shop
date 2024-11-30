import Image from "next/image";

interface Props {
  src?: string;
  alt: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>["className"];
  style?: React.StyleHTMLAttributes<HTMLImageElement>["style"];
  width: number;
  height: number;
}
export const ProductComponentImage = ({
  src,
  alt,
  className,
  style,
  width,
  height,
}: Props) => {
  //con esta condicion manejo tres posibles escenarios, que el usuario agregue la imagen desde una url, sino de manera local y en caso de no ser agregada.
  const localSrc = src
    ? src.startsWith("http")
      ? src
      : `/products/${src}`
    : "/imgs/placeholder.jpg";
  return (
    <Image
      alt={alt}
      src={localSrc}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  );
};
