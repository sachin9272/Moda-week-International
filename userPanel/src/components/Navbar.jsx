import React, { useState, useEffect } from "react";
import { Menu, X, ChevronRight, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/glodenlogo.png";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle hash scroll on mount and update
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.hash]);

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
    { name: "Upcoming Events", path: "/events", category: "Events" },
    { name: "Past Events", path: "/past-events", category: "Events" },
    { name: "About Us", path: "/about", category: "ABOUT MODA" },
    { name: "Production Team", path: "/production-team", category: "ABOUT MODA" },
    { name: "Newsroom", path: "/news-room", category: "News" },
    // { name: "Press & Media", path: "/press-media", category: "News" },
    { name: "Donation", path: "/donation", category: "MEMBERSHIPS & SUPPORT" },
    { name: "Contact Us", path: "/contact", category: "ABOUT MODA" },
    { name: "Membership Programs", path: "/membership-program", category: "MEMBERSHIPS & SUPPORT" },
    { name: "Buy Tickets", path: "/tickets", category: "MEMBERSHIPS & SUPPORT" },
    { name: "Designers", path: "/participants", category: "Events" },
  ];

  return (
    <>
      {/* Top Bar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || isMenuOpen
          ? "bg-black shadow-lg"
          : "bg-linear-to-b from-black/90 to-transparent"
          }`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="w-full px-6 h-20 flex justify-between items-center">
          {/* Menu Toggle - Left (Mobile/Tablet Only) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex md:hidden items-center gap-2 text-white hover:text-[#C7913E] transition-colors group z-50"
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
          </button>

          {/* Desktop Navigation - Left/Center */}
          <div className="hidden md:flex items-center gap-12 h-full">
            {["ABOUT MODA", "Events", "MEMBERSHIPS & SUPPORT", "News"].map((category) => (
              category === "News" ? (
                <Link
                  key={category}
                  to="/news-room"
                  onMouseEnter={() => setActiveDropdown(null)}
                  className="relative h-full flex items-center text-sm font-bold tracking-[0.2em] uppercase text-[#C7913E] hover:text-white transition-colors"
                >
                  {category}
                </Link>
              ) : (
                <div
                  key={category}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setActiveDropdown(category)}
                >
                  <button
                    className={`text-sm font-bold tracking-[0.2em] uppercase transition-colors ${activeDropdown === category ? "text-white" : "text-[#C7913E] hover:text-white"
                      }`}
                  >
                    {category}
                  </button>
                  {/* Dropdown */}
                  <AnimatePresence>
                    {activeDropdown === category && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 bg-black/60 backdrop-blur-md min-w-[240px] shadow-2xl border-t border-white/20"
                      >
                        <div className="py-4 flex flex-col">
                          {navLinks
                            .filter((link) => link.category === category)
                            .map((link) => (
                              <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setActiveDropdown(null)}
                                className="px-6 py-3 text-sm text-[#C7913E] hover:text-white hover:bg-black/10 transition-all flex items-center justify-between group font-medium"
                              >
                                <span>{link.name}</span>
                                <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-white" />
                              </Link>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            ))}
            <Link
              to="/registration"
              onMouseEnter={() => setActiveDropdown(null)}
              className="text-sm font-bold tracking-[0.2em] uppercase text-[#C7913E] hover:text-white transition-colors"
            >
              Registration
            </Link>
            <a
              href="https://selectvoyage.net/"
              onMouseEnter={() => setActiveDropdown(null)}
              className="text-sm font-bold tracking-[0.2em] uppercase text-[#C7913E] hover:text-white transition-colors"
            >
              Travel
            </a>
          </div>

          {/* Logo - Right (Mobile) / Center (Desktop? kept right for now to match layout) */}
          <Link to="/" className="z-50">
            <img
              src={logo}
              alt="Moda Week International"
              className="h-10 md:h-12"
            />
          </Link>
        </div>
      </nav>

      {/* Full Screen Menu Overlay (Mobile/Tablet Only) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 bg-[#0a0a0a] pt-24 pb-10 overflow-y-auto bg-white text-black md:hidden"
          >
            <div className="container mx-auto px-6 h-full flex flex-col">
              {/* Menu Grid */}
              <div className="flex flex-col gap-8 mt-4">
                {/* Group: ABOUT MODA */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-gray-200 pb-2 mb-4 text-gray-400">
                    ABOUT MODA
                  </h3>
                  {navLinks
                    .filter((l) => l.category === "ABOUT MODA")
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
                          className="block text-2xl font-serif text-black hover:text-[#C7913E] transition-colors"
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}
                </div>

                {/* Group: Events */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-gray-200 pb-2 mb-4 text-gray-400">
                    Events
                  </h3>
                  {navLinks
                    .filter((l) => l.category === "Events")
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
                          className="block text-2xl font-serif text-black hover:text-[#C7913E] transition-colors"
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}
                </div>

                {/* Group: MEMBERSHIPS & SUPPORT */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-gray-200 pb-2 mb-4 text-gray-400">
                    MEMBERSHIPS & SUPPORT
                  </h3>
                  {navLinks
                    .filter((l) => l.category === "MEMBERSHIPS & SUPPORT")
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
                          className="block text-2xl font-serif text-black hover:text-[#C7913E] transition-colors"
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}
                </div>

                {/* Group: News */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-gray-200 pb-2 mb-4 text-gray-400">
                    News
                  </h3>
                  {navLinks
                    .filter((l) => l.category === "News")
                    .map((link, i) => (
                      <motion.div
                        key={link.name}
                        custom={i + 6}
                        variants={linkVariants}
                        initial="closed"
                        animate="open"
                      >
                        <Link
                          to={link.path}
                          onClick={() => setIsMenuOpen(false)}
                          className="block text-2xl font-serif text-black hover:text-[#C7913E] transition-colors"
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-gray-200 pb-2 mb-4 text-gray-400">
                    Registration
                  </h3>
                  <motion.div
                    custom={10}
                    variants={linkVariants}
                    initial="closed"
                    animate="open"
                  >
                    <Link
                      to="/registration"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-serif text-black hover:text-[#C7913E] transition-colors"
                    >
                      Registration
                    </Link>
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-gray-200 pb-2 mb-4 text-gray-400">
                    Travel
                  </h3>
                  <motion.div
                    custom={11}
                    variants={linkVariants}
                    initial="closed"
                    animate="open"
                  >
                    <a
                      href="https://selectvoyage.net/"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-2xl font-serif text-black hover:text-[#C7913E] transition-colors"
                    >
                      Travel
                    </a>
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
