import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const containerRef = useRef(null);

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "Manhattan, NY",
      rating: 5,
      review:
        "Absolutely amazing service! My apartment has never been cleaner. The team was professional and thorough.",
      date: "2 days ago",
    },
    {
      id: 2,
      name: "John Doe",
      location: "Brooklyn, NY",
      rating: 5,
      review:
        "Outstanding deep cleaning service. They paid attention to every detail and left my place sparkling!",
      date: "1 week ago",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      location: "Queens, NY",
      rating: 5,
      review:
        "Reliable and efficient. The cleaners were punctual and did an excellent job. Highly recommend!",
      date: "3 days ago",
    },
    {
      id: 4,
      name: "David Thompson",
      location: "Bronx, NY",
      rating: 5,
      review:
        "Best cleaning service in NYC! Fair pricing and exceptional results. Will definitely use again.",
      date: "2 weeks ago",
    },
    {
      id: 5,
      name: "Jennifer Park",
      location: "Manhattan, NY",
      rating: 5,
      review:
        "Professional, thorough, and affordable. My go-to cleaning service from now on!",
      date: "5 days ago",
    },
    {
      id: 6,
      name: "Robert Williams",
      location: "Staten Island, NY",
      rating: 5,
      review:
        "Impressed with their attention to detail. The team was friendly and left everything spotless.",
      date: "1 week ago",
    },
  ];

  // Calculate visible items based on screen size
  const getVisibleCount = () => {
    if (typeof window === "undefined") return 4;
    return window.innerWidth < 768 ? 3 : 4;
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount());

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const getVisibleReviews = () => {
    const visibleReviews = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % reviews.length;
      visibleReviews.push(reviews[index]);
    }
    return visibleReviews;
  };

  // Star rating component
  const StarRating = ({ rating }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.svg
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`h-4 w-4 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </motion.svg>
      ))}
    </div>
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-purple-200 py-10"
      ref={containerRef}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="font-cinzel mb-4 text-3xl font-bold text-purple-600 lg:text-4xl">
            What Our Clients Say
          </h2>
          <p className="font-lora mx-auto max-w-2xl text-lg text-gray-600">
            Don't just take our word for it - hear from our satisfied customers
            across NYC
          </p>
        </motion.div>

        {/* Reviews Container */}
        <div className="relative mx-auto max-w-7xl">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="absolute top-1/2 left-0 z-10 -translate-x-4 -translate-y-1/2 rounded-full border border-purple-300 bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white"
          >
            <svg
              className="spiffy-text h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="absolute top-1/2 right-0 z-10 translate-x-4 -translate-y-1/2 rounded-full border border-purple-300 bg-white/80 p-3 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white"
          >
            <svg
              className="spiffy-text h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence mode="wait">
              {getVisibleReviews().map((review, index) => (
                <motion.div
                  key={`${review.id}-${currentIndex}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-2xl border border-purple-300 bg-white p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Rating */}
                  <div className="mb-4">
                    <StarRating rating={review.rating} />
                  </div>

                  {/* Review Text */}
                  <p className="font-lora mb-4 line-clamp-4 text-sm text-gray-700">
                    "{review.review}"
                  </p>

                  {/* Client Info */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="font-elsie font-semibold text-gray-700">
                      {review.name}
                    </div>
                    <div className="font-quicksand flex items-center justify-between text-sm text-gray-500">
                      <span>{review.location}</span>
                      <span className="text-xs">{review.date}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Progress Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-6 bg-purple-400"
                    : "spiffy-bg-medium"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Read More Reviews Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <button className="group font-elsie relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700 hover:shadow-2xl">
            <span>Read More Reviews</span>
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 translate-x-full -skew-x-12 transform bg-white/20 transition-transform duration-1000 group-hover:translate-x-0"></div>
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Reviews;
