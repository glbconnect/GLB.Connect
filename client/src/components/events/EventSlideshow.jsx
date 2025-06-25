import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slick-arrow`}
      style={{ ...style, display: 'block', right: '25px', zIndex: 10 }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slick-arrow`}
      style={{ ...style, display: 'block', left: '25px', zIndex: 10 }}
      onClick={onClick}
    />
  );
};

const EventSlideshow = ({ events, onSlideClick }) => {
  const settings = {
    dots: true,
    infinite: events.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className="mb-12 relative">
      <Slider {...settings}>
        {events.map(event => (
          <div key={event.id} className="px-2" onClick={() => onSlideClick(event)}>
            <div className="relative cursor-pointer rounded-lg overflow-hidden shadow-lg">
              <img src={event.imageUrl || 'https://via.placeholder.com/600x300'} alt={event.title} className="w-full h-64 object-cover" />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                <h3 className="text-white text-2xl font-bold">{event.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default EventSlideshow;
