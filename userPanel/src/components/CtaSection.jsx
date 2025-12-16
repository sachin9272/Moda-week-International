import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-5 px-4 bg-white flex items-center justify-center">
      <div className="max-w-full w-[900px] mx-auto text-center bg-black border-4 border-transparent [border-image:linear-gradient(to_right,#C7913E,#8C5D25)_1] p-10">
        <h2 className="text-4xl md:text-[40px] font-bold mb-6">
          Join the MWINTL Experience
        </h2>
        <p className="text-xl mb-8">
          Be part of the world's fastest-growing global fashion network
        </p>
        <Link to="/service?tab=designer">
        <button className="grad-bg text-white px-8 py-3 text-lg font-semibold transition">
          GET STARTED <ArrowRight className="inline" />
        </button>
        </Link>
      </div>
    </section>
  );
}
