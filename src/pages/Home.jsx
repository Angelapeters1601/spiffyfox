import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Reviews from "../pages/Reviews";
import {
  FaStar,
  FaPhone,
  FaSmile,
  FaHandshake,
  FaHeart,
  FaLeaf,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// images
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";
import img5 from "../assets/img5.jpg";
import img6 from "../assets/img6.jpg";
import img7 from "../assets/img7.jpg";
import img8 from "../assets/img8.jpg";
import img9 from "../assets/img9.jpg";
import cleaning from "../assets/cleaning.png";
import team from "../assets/team.png";
import team2 from "../assets/team-.png";

const services = [
  {
    name: "Residential Cleaning",
    image: img1,
    description:
      "Comprehensive home cleaning services including dusting, vacuuming, mopping, and sanitizing all living spaces for a spotless home environment.",
  },
  {
    name: "Commercial Cleaning",
    image: img2,
    description:
      "Professional office and commercial space cleaning with customized schedules to maintain pristine business environments after hours.",
  },
  {
    name: "Deep Cleaning",
    image: img3,
    description:
      "Intensive cleaning service targeting hard-to-reach areas, grout, baseboards, and appliances for a thorough sanitization of your entire property.",
  },
  {
    name: "Power Washing",
    image: img4,
    description:
      "High-pressure exterior cleaning for driveways, sidewalks, decks, and building exteriors to remove stubborn dirt, mold, and grime buildup.",
  },
  {
    name: "Organization",
    image: img5,
    description:
      "Professional organizing services for closets, pantries, offices, and storage areas creating functional, clutter-free spaces that maximize efficiency.",
  },
  {
    name: "Junk Removal",
    image: img6,
    description:
      "Efficient removal and proper disposal of unwanted items, furniture, and debris with eco-friendly recycling practices whenever possible.",
  },
  {
    name: "Packing & Unpacking",
    image: img7,
    description:
      "Full-service packing solutions using premium materials to safely secure your belongings for moves, with organized unpacking services available.",
  },
  {
    name: "Personal Assistance",
    image: img8,
    description:
      "Customized support services including errand running, home management, and personal organization to simplify your busy lifestyle and schedule.",
  },
];

const Home = () => {
  const swiperRef = useRef(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Carousel Section */}
      <section className="relative h-screen overflow-hidden">
        <Swiper
          ref={swiperRef}
          modules={[Autoplay, EffectFade]}
          effect="fade"
          speed={1500}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            waitForTransition: true,
          }}
          fadeEffect={{ crossFade: true }}
          className="h-full w-full"
        >
          {services.map((service, index) => (
            <SwiperSlide key={service.name} className="relative">
              {/* Background Image with Overlay */}
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${service.image})` }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 via-purple-600/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20"></div>

                {/* Floating Text Container */}
                <div className="absolute top-1/2 left-8 z-20 -translate-y-1/2 transform lg:left-16">
                  <motion.div
                    initial={{ opacity: 0, x: -80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="max-w-lg"
                  >
                    {/* Main Heading */}
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="font-cinzel mb-6 text-5xl leading-tight font-bold text-white drop-shadow-2xl lg:text-6xl"
                    >
                      The best Cleaning service company in{" "}
                      <span className="bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent">
                        NYC
                      </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="font-elsie mb-8 text-xl text-purple-100 drop-shadow-lg"
                    >
                      Click the button below to call for a free quote 💜😍
                    </motion.p>

                    {/* Call to Action */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.8 }}
                      className="flex flex-col gap-4 sm:flex-row sm:items-center"
                    >
                      <motion.a
                        href="tel:202-670-6167"
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 20px 40px rgba(177, 156, 217, 0.3)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="font-elsie inline-flex items-center gap-3 rounded-full bg-white/20 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/30"
                      >
                        <FaPhone className="text-purple-200" />
                        Call (202)-670-6167
                      </motion.a>

                      {/* Free Quote Badge */}
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="font-elsie text-sm text-purple-200"
                      >
                        ✨ Free Quotes Available
                      </motion.span>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Animated Service Card */}
                <motion.div
                  initial={{ opacity: 0, y: 100, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.8,
                    duration: 1,
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 100,
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -10,
                  }}
                  className="absolute right-8 bottom-20 z-10 lg:right-16 lg:bottom-1/2 lg:translate-y-1/2"
                >
                  <div className="relative">
                    {/* Glow Effect */}
                    <div className="absolute -inset-4 rounded-3xl bg-purple-500/20 blur-2xl"></div>

                    {/* Service Card */}
                    <div className="relative min-w-[280px] rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <div className="rounded-full bg-purple-500 px-4 py-1">
                          <span className="font-elsie text-sm font-semibold text-white">
                            Featured Service
                          </span>
                        </div>
                      </div>

                      <h3 className="font-elsie mb-3 text-3xl font-semibold text-white drop-shadow-lg">
                        {service.name}
                      </h3>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="font-lora text-sm text-purple-100"
                      >
                        {service.description}
                      </motion.p>

                      {/* Decorative Elements */}
                      <div className="absolute -bottom-2 -left-2 h-6 w-6 rounded-full bg-purple-400/30"></div>
                      <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-purple-300/40"></div>
                    </div>
                  </div>
                </motion.div>

                {/* Progress Indicator */}
                <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 transform">
                  <div className="flex gap-2">
                    {services.map((_, i) => (
                      <motion.div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-500 ${
                          i === index ? "w-8 bg-white" : "w-2 bg-white/40"
                        }`}
                        initial={false}
                        animate={{
                          width: i === index ? 32 : 8,
                          backgroundColor:
                            i === index ? "#ffffff" : "rgba(255,255,255,0.4)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/*  Hero Section */}
      <section
        className="relative bg-contain bg-center bg-no-repeat py-20"
        style={{ backgroundImage: `url(${cleaning})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-cinzel mb-6 text-6xl font-bold sm:text-6xl"
          >
            Transforming Spaces, Elevating Lives
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-lora mb-8 text-xl"
          >
            Professional cleaning services that exceed expectations and bring
            sparkle to every corner
          </motion.p>
        </div>
      </section>

      {/* Services Marquee */}
      <section className="bg-purple-50 py-15">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-cinzel mb-12 text-center text-4xl font-bold text-purple-900">
            Why choose us
          </h2>

          <div className="overflow-hidden">
            <motion.div
              className="flex space-x-8"
              animate={{ x: [0, -1000] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              {services.map((service, index) => (
                <div
                  key={index}
                  className="w-80 flex-shrink-0 overflow-hidden rounded-2xl bg-white shadow-lg"
                >
                  <img
                    src={service.image}
                    alt={service.name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-cormorant text-2xl font-bold text-purple-900">
                      {service.name}
                    </h3>
                    <p className="font-lora text-sm text-gray-600">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="font-cinzel spiffy-bg-dark inline-block rounded-lg px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-purple-800"
            >
              Explore All Services 💜🧹
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-purple-400 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-cinzel mb-16 text-center text-4xl font-bold text-purple-900">
            What Our Clients Say
          </h2>
          {/* Placeholder for Review Component */}
          <div className="text-center text-gray-600">
            <Reviews />
          </div>
        </div>
      </section>

      {/* Career CTA Section */}
      <section className="relative overflow-hidden py-28">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50"></div>
        <div className="absolute top-0 right-0 h-72 w-72 translate-x-36 -translate-y-36 rounded-full bg-purple-200 opacity-60 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-48 translate-y-48 rounded-full bg-blue-200 opacity-40 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center lg:flex-row">
            {/* Text Content  */}
            <div className="relative lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                {/* Floating Badge */}
                <div className="absolute -top-4 -left-4 z-10">
                  <div className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2 shadow-lg">
                    <span className="font-elsie text-sm font-semibold text-white">
                      We're Hiring! 🚀
                    </span>
                  </div>
                </div>

                {/* Main Content Card */}
                <div className="relative rounded-3xl border border-white/20 bg-white/80 p-12 shadow-2xl backdrop-blur-sm">
                  <div className="absolute top-0 left-0 h-6 w-6 rounded-tl-lg border-t-2 border-l-2 border-purple-400"></div>
                  <div className="absolute top-0 right-0 h-6 w-6 rounded-tr-lg border-t-2 border-r-2 border-purple-400"></div>
                  <div className="absolute bottom-0 left-0 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-purple-400"></div>
                  <div className="absolute right-0 bottom-0 h-6 w-6 rounded-br-lg border-r-2 border-b-2 border-purple-400"></div>

                  <h2 className="font-cinzel mb-6 text-3xl leading-tight font-bold lg:text-4xl">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Nationwide Career
                    </span>
                    <br />
                    <span className="text-gray-800">Opportunities Await</span>
                  </h2>

                  <div className="mb-8 space-y-4">
                    <p className="font-lora text-lg leading-relaxed text-gray-700">
                      SpiffyFox is seeking passionate individuals who thrive on
                      transforming spaces and creating exceptional customer
                      experiences. Join our dynamic family of cleaning
                      professionals.
                    </p>

                    {/* Benefits List */}
                    <div className="grid grid-cols-1 gap-3 pt-4">
                      {[
                        "Competitive Pay & Benefits 💰",
                        "Flexible Scheduling ⏰",
                        "Career Growth Opportunities 📈",
                        "Positive Work Environment 🌟",
                      ].map((benefit, index) => (
                        <motion.div
                          key={benefit}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                            <FaCheck className="text-xs text-green-600" />
                          </div>
                          <span className="font-elsie text-gray-700">
                            {benefit}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <motion.div
                    className="flex flex-col gap-4 sm:flex-row sm:items-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      to="/join"
                      className="group font-elsie relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700 hover:shadow-2xl"
                    >
                      <span>Join Our Dream Team</span>
                      <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                      <div className="absolute inset-0 translate-x-full -skew-x-12 transform bg-white/20 transition-transform duration-1000 group-hover:translate-x-0"></div>
                    </Link>

                    <Link
                      to="/join"
                      className="font-elsie text-purple-600 transition-all duration-300 hover:text-purple-800 hover:underline"
                    >
                      View Open Positions →
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Image Section  */}
            <div className="relative mt-16 lg:mt-0 lg:w-1/2 lg:pl-16">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                {/* Main Image Container */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src={team}
                    alt="SpiffyFox Team Members"
                    className="h-[500px] w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent"></div>
                </div>

                {/* Floating Stats Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -bottom-6 -left-6 rounded-2xl border border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur-sm"
                >
                  <div className="text-center">
                    <div className="font-cinzel text-2xl font-bold text-purple-600">
                      200+
                    </div>
                    <div className="font-elsie text-sm text-gray-600">
                      Team Members
                    </div>
                  </div>
                </motion.div>

                {/* Floating Review Card */}
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -top-6 -right-4 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 p-4 shadow-2xl"
                >
                  <div className="flex items-center gap-2 text-white">
                    <FaStar className="text-yellow-300" />
                    <span className="font-elsie font-semibold">4.9/5</span>
                  </div>
                  <div className="font-elsie mt-1 text-xs text-white/90">
                    Employee Satisfaction
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="bg-contain bg-center bg-no-repeat py-20 text-white"
        style={{ backgroundImage: `url(${team2})` }}
      >
        <div className="absolute inset-0 bg-purple-900/80"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center">
          <h2 className="font-cinzel mb-16 text-5xl font-bold text-purple-900">
            Consistently Delightful Cleaning Service
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
            {[
              {
                title: "Top Rated",
                description:
                  "Highest rated cleaning service with 5-star reviews",
                icon: FaStar,
                color: "text-yellow-500",
                bgColor: "bg-yellow-50",
              },
              {
                title: "Delightful Customer Service",
                description:
                  "Friendly, professional staff always ready to help",
                icon: FaSmile,
                color: "text-green-500",
                bgColor: "bg-green-50",
              },
              {
                title: "Trusted Partners",
                description:
                  "Reliable partnerships with businesses and homeowners",
                icon: FaHandshake,
                color: "text-blue-500",
                bgColor: "bg-blue-50",
              },
              {
                title: "Positive Impact",
                description: "Making communities cleaner and healthier",
                icon: FaHeart,
                color: "text-red-500",
                bgColor: "bg-red-50",
              },
              {
                title: "Eco Friendly",
                description: "Environmentally conscious cleaning solutions",
                icon: FaLeaf,
                color: "text-emerald-500",
                bgColor: "bg-emerald-50",
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-stone-200 text-center shadow-2xl shadow-purple-400"
                >
                  <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-white/30 bg-white/20 p-6 backdrop-blur-sm">
                    <div className={`${feature.color} mb-3 text-4xl`}>
                      <IconComponent />
                    </div>
                    <h3 className="font-cormorant mb-4 border-b-2 border-purple-200 text-2xl font-bold font-semibold text-purple-600">
                      {feature.title}
                    </h3>
                    <p className="font-lora text-sm text-stone-800">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
