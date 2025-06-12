"use client";
import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Sarah Taylor",
    role: "CEO & Founder, GDN",
    image: "/sarah.png",
    quote: "Since incorporating FinEase, our financial operations have reached new heights of efficiency. The platform’s seamless integration with our existing systems has saved us countless hours of manual data entry.",
  },
  {
    name: "Ellyse Perry",
    role: "CEO & Founder, GDN",
    image: "/ellyse.png",
    quote: "As a CFO, I’ve used many financial software solutions throughout my career, but none have impressed me as much as FinEase. Just love it!",
  },
  {
    name: "Chris Woakes",
    role: "CEO & Founder, GDN",
    image: "/chris.png",
    quote: "Choosing FinEase has been a game-changer for our startup’s financial management. We needed something affordable and powerful, and this platform delivered on both fronts.",
  },
  {
    name: "Amelia Jenkins",
    role: "Finance Manager, NovaCorp",
    image: "/amelia.png",
    quote: "FinEase's analytics have been essential to our growth. The insights are clear, actionable, and save me hours every week. Total game-changer!",
  },
  {
    name: "David Kim",
    role: "Founder, Startix",
    image: "/david.png",
    quote: "FinEase combines usability and performance like no other platform. It scaled perfectly as our team grew — highly recommend for startups.",
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

const Members = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="w-full min-h-screen bg-gradient-to-br from-pink-100/10 via-white to-purple-100/10 py-20 px-4 md:px-10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Why <span className="text-purple-500">Choose</span> Finance SaaS FinEase?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl flex flex-col justify-between h-full hover:scale-105 transition-transform duration-300"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <div>
                <div className="flex mb-3 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" stroke="none" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm md:text-base mb-6">{item.quote}</p>
              </div>
              <div className="flex items-center mt-auto">
                <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <p className="text-xs text-gray-500">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Members;
