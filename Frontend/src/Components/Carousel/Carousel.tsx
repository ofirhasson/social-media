import { CarouselProps } from "../../Models/Interfaces";
import "./Carousel.css";
import { useCarousel } from "./hooks/useCarousel";

export function Carousel({ post }: CarouselProps): JSX.Element {
  const { currentSlide, nextSlide, prevSlide } = useCarousel(post);

  return (
    <div className="carousel border-2 relative border-black  xs:w-auto xxs:w-auto ">
      {post?.photosUrl?.map((photo, index) => (
        <div
          key={index}
          className={`carousel-item  w-full transition-opacity duration-500 ${
            currentSlide === index ? "opacity-100" : "opacity-0"
          } `}
        >
          <img src={photo} className="w-full" alt={`Slide ${index + 1}`} />
          <div className="absolute -left-5 -right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <button
              className={`btn ${
                post?.photosUrl?.length === 1 && "hidden"
              } btn-circle`}
              onClick={prevSlide}
            >
              ❮
            </button>
            <button
              className={`btn ${
                post?.photosUrl?.length === 1 && "hidden"
              } btn-circle`}
              onClick={nextSlide}
            >
              ❯
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
