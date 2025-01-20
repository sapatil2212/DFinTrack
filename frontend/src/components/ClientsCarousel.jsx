import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const logoUrls = [
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", // Amazon

  "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", // Netflix
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", // Amazon

  "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", // Netflix
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", // Amazon

  "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", // Netflix
];

const ClientsCarousel = () => {
  const [position, setPosition] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    const animate = () => {
      setPosition((prev) => {
        const scrollWidth = carousel.scrollWidth;
        const visibleWidth = carousel.clientWidth;
        return prev >= scrollWidth - visibleWidth ? 0 : prev + 0.5;
      });
    };

    const intervalId = setInterval(animate, 16); // 60 FPS

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative w-full overflow-hidden py-8 bg-white 0">
      <motion.div
        ref={carouselRef}
        className="flex items-center gap-x-16 md:gap-x-24"
        style={{
          transform: `translateX(-${position}px)`,
        }}
      >
        {[...logoUrls, ...logoUrls, ...logoUrls].map((url, index) => (
          <div
            key={index}
            className="flex-shrink-0 transition-transform transform hover:scale-110 duration-300"
          >
            <img
              src={url}
              alt={`Client logo ${index + 1}`}
              className="w-20 h-auto md:w-24 mx-auto "
            />
          </div>
        ))}
      </motion.div>

      {/* Subtle Overlay gradients */}
      <div className="pointer-events-none absolute top-0 left-0 z-10 w-16 h-full bg-gradient-to-r from-white via-transparent to-transparent "></div>
      <div className="pointer-events-none absolute top-0 right-0 z-10 w-16 h-full bg-gradient-to-l from-white via-transparent to-transparent"></div>
    </div>
  );
};

export default ClientsCarousel;
