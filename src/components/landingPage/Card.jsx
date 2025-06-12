import React from 'react';


const Card = () => {
  return (
    <section className="flex items-center justify-center px-4 py-20 sm:px-10 md:px-20">
      <div
        className="relative w-full max-w-5xl rounded-3xl text-center text-white overflow-hidden shadow-2xl bg-cover bg-center"
        style={{ backgroundImage: "url('/card.png')" }} // Replace with your image path
      >
        {/* Foreground Content */}
        <div className="relative z-10 px-4 sm:px-10 md:px-16 py-12 rounded-3xl bg-black/50 backdrop-blur-md border border-white/10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-snug mb-6 text-white drop-shadow-md">
            Empowering Your <br /> Financial Analysis
          </h1>
          <p className="text-xs md:text-sm text-purple-200 mb-8 max-w-2xl mx-auto">
            Your all-in-one AI financial advisor track your portfolio, analyze stocks, view insights, and get instant answers to your money questions. Just log in and take control!
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <button className="bg-white text-purple-700 px-6 py-2.5 rounded-full font-semibold shadow-lg hover:scale-105 transition">
              Get Started
            </button>
            <button className="bg-gradient-to-r from-white/10 to-white/5 text-white px-6 py-2.5 rounded-full font-semibold border border-white/20 hover:scale-105 transition">
              Learn More
            </button>
          </div>

          
        </div>
      </div>
    </section>
  );
};

export default Card;
