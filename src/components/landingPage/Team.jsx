// Team.jsx
import React from 'react';
import { ShieldCheck, CreditCard, DollarSign, Headphones } from 'lucide-react';

const features = [
  {
    icon: <CreditCard className="w-8 h-8 text-white" />, 
    title: 'Stock Visualizer',
    desc: 'Track your investments like a pro! Add your stocks, view real-time gains/losses, sector distribution, stock allocation, and get smart visuals to manage your portfolio with ease.',
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-white" />,
    title: 'Stock Risk Analyser',
    desc: 'StockMatrix analyzes any stock beta, CAGR, and risk probability with 95% and 99% confidence — all based on your selected timeframe.',
  },
  {
    icon: <DollarSign className="w-8 h-8 text-white" />,
    title: 'Fundamental Analyser',
    desc: 'Get Technical Analysis, SWOT, QVT Score, Checklist & more — just by entering the stock name. Fast, powerful, and investor-ready.',
  },
  {
    icon: <Headphones className="w-8 h-8 text-white" />,
    title: 'Financial Statement',
    desc: 'FinView shows a stock balance sheet, income statement, and cash flow — quarterly or annually — for smarter financial decisions.',
  },
];

const Team = () => {
  return (
    <section className="py-20 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why <span className="text-purple-500">Choose</span> Finance<br />
             FinEase?
          </h2>
          <p className="text-gray-600 mb-8 max-w-lg">
            All-in-one AI financial advisor
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1c1b43] rounded-3xl text-white p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-4">Finchat Bot</h3>
            <p className="text-sm text-gray-300 mb-6">
              Got finance questions? Ask away! Our smart AI chatbot gives instant, personalized answers based on your portfolio. Your 24/7 financial guide.
            </p>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full font-semibold">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
