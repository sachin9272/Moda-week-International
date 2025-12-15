import React, { useState, useEffect } from "react";
import { Menu, X, ChevronRight, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/glodenlogo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menu Animation Variants
  const menuVariants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const navLinks = [
    { name: "Global Events", path: "/events", category: "Experience" },
    { name: "Past Events", path: "/past-events", category: "Experience" },
    { name: "Services", path: "/service", category: "Business" },
    { name: "About Us", path: "/about", category: "Company" },
    { name: "Newsroom", path: "/news-room", category: "Company" },
    { name: "Partners", path: "#", category: "Business" },
    { name: "Designers", path: "/fashion-designers", category: "Experience" },
  ];

  return (
    <>
      {/* Top Bar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || isMenuOpen
            ? "bg-black"
            : "bg-linear-to-b from-black/90 to-transparent"
          } !font-[sans-serif]`}
      >
        <div className="container px-6 h-20 flex justify-between items-center">
          {/* Menu Toggle - Left */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 text-white hover:text-[#C7913E] transition-colors group z-50"
          >
            <div className="relative w-6 h-6">
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span className="text-sm font-medium tracking-widest hidden md:block">
              {isMenuOpen ? "CLOSE" : "MENU"}
            </span>
          </button>

          {/* Logo - Right */}
          <Link to="/" className="z-50">
            <img
              src={logo}
              alt="Moda Week International"
              className="h-10 md:h-16"
            />
          </Link>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 bg-[#0a0a0a] pt-24 pb-10 overflow-y-auto bg-white text-black"
          >
            <div className="container mx-auto px-6 h-full flex flex-col">
              {/* Menu Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 flex-1 mt-12">
                {/* Main Links Area */}
                <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 content-start">
                  {/* Group: Experience */}
                  <div className="space-y-6">
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ delay: 0.4 }}
                      className="text-xs font-bold tracking-[0.2em] uppercase border-b border-white/20 pb-2 mb-6"
                    >
                      Experience
                    </motion.h3>
                    {navLinks
                      .filter((l) => l.category === "Experience")
                      .map((link, i) => (
                        <motion.div
                          key={link.name}
                          custom={i}
                          variants={linkVariants}
                          initial="closed"
                          animate="open"
                        >
                          <Link
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="group flex items-center justify-between text-2xl md:text-4xl font-light text-black hover:text-[#C7913E] transition-colors py-2"
                          >
                            <span className="font-[Playfair_Display] italic">
                              {link.name}
                            </span>
                            <ChevronRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#C7913E]" />
                          </Link>
                        </motion.div>
                      ))}
                  </div>

                  {/* Group: Business */}
                  <div className="space-y-6">
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ delay: 0.5 }}
                      className="text-xs font-bold tracking-[0.2em] text-black uppercase border-b border-white/20 pb-2 mb-6"
                    >
                      Business
                    </motion.h3>
                    {navLinks
                      .filter((l) => l.category === "Business")
                      .map((link, i) => (
                        <motion.div
                          key={link.name}
                          custom={i + 2}
                          variants={linkVariants}
                          initial="closed"
                          animate="open"
                        >
                          <Link
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="group flex items-center justify-between text-2xl md:text-4xl font-light text-black hover:text-[#C7913E] transition-colors py-2"
                          >
                            <span className="font-[Playfair_Display] italic">
                              {link.name}
                            </span>
                            <ChevronRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#C7913E]" />
                          </Link>
                        </motion.div>
                      ))}
                  </div>

                  {/* Group: Company */}
                  <div className="space-y-6">
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ delay: 0.6 }}
                      className="text-xs font-bold tracking-[0.2em] uppercase border-b border-white/20 pb-2 mb-6"
                    >
                      Company
                    </motion.h3>
                    {navLinks
                      .filter((l) => l.category === "Company")
                      .map((link, i) => (
                        <motion.div
                          key={link.name}
                          custom={i + 4}
                          variants={linkVariants}
                          initial="closed"
                          animate="open"
                        >
                          <Link
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="group flex items-center justify-between text-2xl md:text-4xl font-light hover:text-[#C7913E] transition-colors py-2"
                          >
                            <span className="font-[Playfair_Display] italic">
                              {link.name}
                            </span>
                            <ChevronRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#C7913E]" />
                          </Link>
                        </motion.div>
                      ))}
                  </div>
                </div>

                {/* Sidebar / Featured Image */}
                <div className="md:col-span-4 hidden md:block">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="h-full w-full bg-[#111] rounded-lg overflow-hidden relative group"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80"
                      alt="Featured"
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-8 left-8">
                      <h4 className="text-white text-3xl font-[Playfair_Display] italic mb-2">
                        Next Season
                      </h4>
                      <p className="text-gray-400 text-sm tracking-widest uppercase">
                        Registration Open
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
