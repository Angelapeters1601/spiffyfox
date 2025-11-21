import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { FaCompass, FaMapMarkerAlt } from "react-icons/fa";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import delaware from "../assets/delaware2.jpg";
import baltimore from "../assets/baltimore.jpg";
import newJersey from "../assets/new jersey.jpg";
import newYork from "../assets/new york city.jpg";
import philadelphia from "../assets/philadelphia.jpg";
import stLouis from "../assets/st louis.jpg";
import washingtonDc from "../assets/washington dc.jpg";

// 3D Animated Sphere Component
const AnimatedSphere = () => {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial
        color="#6017b4"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};

const Location = () => {
  const containerRef = useRef();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [0.8, 1]);

  const [selectedCity, setSelectedCity] = useState(null);

  // City data with placeholder service areas
  const cities = [
    {
      id: "delaware",
      name: "State of Delaware",
      size: "full",
      image: delaware,
      serviceAreas: [
        "Wilmington",
        "Dover",
        "Newark",
        "Middletown",
        "Smyrna",
        "Milford",
        "Seaford",
        "Georgetown",
      ],
    },
    {
      id: "philadelphia",
      name: "Philadelphia Metro Area",
      size: "half",
      image: philadelphia,
      serviceAreas: [
        "Center City",
        "University City",
        "Northeast Philadelphia",
        "South Philadelphia",
        "West Philadelphia",
        "Manayunk",
      ],
    },
    {
      id: "new-jersey",
      name: "State of New Jersey",
      size: "half",
      image: newJersey,
      serviceAreas: [
        "Cherry Hill",
        "Camden",
        "Princeton",
        "Trenton",
        "Atlantic City",
        "Jersey City",
        "Hoboken",
      ],
    },
    {
      id: "new-york",
      name: "New York City Metro Area",
      size: "quarter",
      image: newYork,
      serviceAreas: [
        "Manhattan",
        "Brooklyn",
        "Queens",
        "Bronx",
        "Staten Island",
        "Long Island",
        "Westchester",
      ],
    },
    {
      id: "baltimore",
      name: "Baltimore Metro Area",
      size: "quarter",
      image: baltimore,
      serviceAreas: [
        "Inner Harbor",
        "Fells Point",
        "Canton",
        "Mount Vernon",
        "Federal Hill",
        "Hampden",
        "Towson",
      ],
    },
    {
      id: "washington-dc",
      name: "Washington, D.C. Metro Area",
      size: "quarter",
      image: washingtonDc,
      serviceAreas: [
        "Northwest DC",
        "Southwest DC",
        "Capitol Hill",
        "Georgetown",
        "Dupont Circle",
        "Adams Morgan",
        "Columbia Heights",
      ],
    },
    {
      id: "st-louis",
      name: "Saint Louis Metro Area",
      size: "quarter",
      image: stLouis,
      serviceAreas: [
        "Downtown St. Louis",
        "Central West End",
        "Soulard",
        "The Hill",
        "Clayton",
        "University City",
        "Webster Groves",
      ],
    },
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50"
    >
      {/* City Popup Modal */}
      {selectedCity && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
          onClick={() => setSelectedCity(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-2xl rounded-2xl bg-white p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCity(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h3 className="font-cinzel mb-4 text-2xl font-bold text-gray-900">
              Service Areas in {selectedCity.name}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {selectedCity.serviceAreas.map((area, index) => (
                <div
                  key={index}
                  className="font-quicksand rounded-lg bg-purple-50 px-3 py-2 text-center text-purple-700"
                >
                  {area}
                </div>
              ))}
            </div>

            <button className="font-quicksand mt-6 w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition-all hover:bg-purple-700">
              Get Service in {selectedCity.name}
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Hero Section with 3D */}
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900" />

        {/* 3D Background */}
        <div className="absolute inset-0 opacity-20">
          <Canvas>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <AnimatedSphere />
            <OrbitControls
              enableZoom={false}
              autoRotate
              autoRotateSpeed={0.5}
            />
          </Canvas>
        </div>

        <motion.div
          className="relative z-10 px-4 text-center text-white"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <FaCompass className="mx-auto h-20 w-20 opacity-90" />
          </motion.div>

          <h1 className="font-cinzel mb-6 text-5xl font-bold sm:text-6xl md:text-8xl">
            Our Locations
          </h1>

          <p className="font-quicksand mx-auto mb-8 max-w-3xl text-xl opacity-90 sm:text-2xl">
            Serving multiple cities with premium cleaning solutions across
            residential and commercial spaces
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <button className="font-quicksand transform rounded-xl bg-white px-8 py-4 text-lg font-semibold text-purple-600 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-100">
              Explore Our Cities
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 transform"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center text-white"
          >
            <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-2 h-3 w-1 rounded-full bg-white"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Cities Grid Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h2 className="font-cinzel mb-4 text-4xl font-bold text-gray-900">
              <div className="flex items-center justify-center gap-4">
                <div className="h-0.5 w-8 bg-purple-400"></div>
                <FaMapMarkerAlt className="text-purple-500" />
                <div className="h-0.5 w-8 bg-purple-400"></div>
              </div>
              Our Service Cities
              <div className="mx-auto mt-2 h-0.5 w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            </h2>
            <p className="font-quicksand mx-auto max-w-2xl text-xl text-gray-600">
              Click on any city to see the specific areas we serve
            </p>
          </motion.div>

          {/* Cities Grid */}
          <div className="grid h-[1000px] grid-cols-4 gap-4">
            {/* Delaware - Full width (spans 4 columns) */}
            <motion.div
              key={cities[0].id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0 }}
              whileHover={{ scale: 1.02 }}
              className="relative col-span-4 cursor-pointer overflow-hidden rounded-2xl"
              onClick={() => setSelectedCity(cities[0])}
            >
              <img
                src={cities[0].image}
                alt={cities[0].name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute right-4 bottom-4 left-4 text-white">
                <h3 className="font-cinzel text-2xl font-bold sm:text-3xl">
                  {cities[0].name}
                </h3>
                <p className="font-quicksand text-sm opacity-90">
                  Click to view service areas
                </p>
              </div>
            </motion.div>

            {/* Philadelphia and New Jersey - Each spans 2 columns */}
            <motion.div
              key={cities[1].id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative col-span-4 cursor-pointer overflow-hidden rounded-2xl md:col-span-2"
              onClick={() => setSelectedCity(cities[1])}
            >
              <img
                src={cities[1].image}
                alt={cities[1].name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute right-4 bottom-4 left-4 text-white">
                <h3 className="font-cinzel text-lg font-bold sm:text-xl md:text-2xl">
                  {cities[1].name}
                </h3>
                <p className="font-quicksand text-xs opacity-90 sm:text-sm">
                  Click to view service areas
                </p>
              </div>
            </motion.div>

            <motion.div
              key={cities[2].id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="relative col-span-4 cursor-pointer overflow-hidden rounded-2xl md:col-span-2"
              onClick={() => setSelectedCity(cities[2])}
            >
              <img
                src={cities[2].image}
                alt={cities[2].name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute right-4 bottom-4 left-4 text-white">
                <h3 className="font-cinzel text-lg font-bold sm:text-xl md:text-2xl">
                  {cities[2].name}
                </h3>
                <p className="font-quicksand text-xs opacity-90 sm:text-sm">
                  Click to view service areas
                </p>
              </div>
            </motion.div>

            {/* Last 4 cities - Each spans 1 column (2x2 grid) */}
            {cities.slice(3).map((city, index) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative col-span-2 cursor-pointer overflow-hidden rounded-2xl md:col-span-1"
                onClick={() => setSelectedCity(city)}
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute right-4 bottom-4 left-4 text-white">
                  <h3 className="font-cinzel text-sm font-bold sm:text-base md:text-lg">
                    {city.name}
                  </h3>
                  <p className="font-quicksand text-xs opacity-90">
                    Click to view service areas
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Location;
