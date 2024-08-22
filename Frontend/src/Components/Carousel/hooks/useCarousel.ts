import { useState } from "react";
import { PostModel } from "../../../Models/PostModel";

export const useCarousel = (post: PostModel) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % post?.photosUrl?.length);
  };

  const prevSlide = (): void => {
    setCurrentSlide((prev) =>
      prev === 0 ? post?.photosUrl?.length - 1 : prev - 1
    );
  };

  return {
    currentSlide,
    prevSlide,
    nextSlide,
  };
};
