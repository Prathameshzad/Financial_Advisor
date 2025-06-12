'use client';
import React from 'react';
import Sidebar from './Sidebar';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

export default function DashboardLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 py-4">
        <div className="flex justify-between items-center mb-4 px-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <span>{user?.name || 'Guest'}</span>
            {/* Uncomment if you have an avatar */}
            {/* <Image src="/next.svg" alt="Avatar" width={32} height={32} className="rounded-full" /> */}
          </div>
        </div>
        <div className="border-2 border-purple-500"></div>
        {children}
      </div>
    </div>
  );
}
