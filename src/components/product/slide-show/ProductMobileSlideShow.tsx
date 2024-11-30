"use client";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import "./slideshow.css";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { ProductComponentImage } from "@/components";

interface Props {
  images: string[];
  title: string;
  className?: string;
}

export const ProductMobileSlideShow = ({ images, title, className }: Props) => {
  return (
    <div className={className}>
      <Swiper
        style={{ width: "100vw", height: "500px" }}
        pagination
        autoplay={{
          delay: 2500,
        }}
        modules={[Autoplay, FreeMode, Pagination]}
        className="mySwiper2"
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <ProductComponentImage
              width={600}
              height={400}
              src={image}
              alt={title}
              className="object-fill"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
