import React from 'react';
import Sidebar from './Sidebar';
import Image from 'next/image';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 py-4">
        <div className="flex justify-between items-center mb-4 px-4">
          <h1 className="text-2xl font-bold">Current Page Name</h1>
          <div className="flex items-center">
            <span>Person's Name</span>
            <Image src="/next.svg" alt="Avatar" width={32} height={32} className="rounded-full mx-4" />
          </div>
        </div>
          <div className='border-2 border-purple-500'></div>
        {children}
      </div>
    </div>
  );
}
