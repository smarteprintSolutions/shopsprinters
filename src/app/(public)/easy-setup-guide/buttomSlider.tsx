"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const images = [
  "/slider-1.webp",
  "/slider-2.webp",
];

const slides = [...images, ...images]; // duplicate for seamless scrolling

export default function BottomSlider() {
  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (current === images.length) {
      const timer = setTimeout(() => {
        setAnimate(false);
        setCurrent(0);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimate(true);
          });
        });
      }, 700); // matches the transform transition-duration configuration speed below

      return () => clearTimeout(timer);
    }
  }, [current]);

  return (
    <section className="bg-white py-8">
      <div className="mx-auto max-w-5xl px-4">

        <div className="relative h-[190px] overflow-hidden rounded-md shadow-sm">

          <div
            className={`flex h-full ${
              animate ? "transition-transform duration-700 ease-in-out" : ""
            }`}
            style={{
              width: `${slides.length * 100}%`,
              transform: `translateX(-${current * (100 / slides.length)}%)`,
            }}
          >
            {slides.map((image, index) => (
              <div
                key={index}
                className="relative h-full flex-shrink-0"
                style={{ width: `${100 / slides.length}%` }}
              >
                <Image
                  src={image}
                  alt={`Slide banner asset ${index}`}
                  fill
                  /* 
                    object-left anchors the graphic container alignment to the left hand side.
                    This prevents the text built inside the image from clipping out on smaller mobile displays.
                  */
                  className="object-cover object-left sm:object-center"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}