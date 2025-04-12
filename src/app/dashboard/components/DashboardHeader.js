'use client';

import { useEffect } from 'react';

const DashboardHeader = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.shopify.com/shopifycloud/app-bridge.js';
    script.onload = () => console.log('App Bridge loaded');
    document.head.appendChild(script);
    
    // Clean up the script tag on component unmount
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <header>
      <h1>Dashboard</h1>
      <nav>
        <ul>
          <li><a href="/dashboard">Home</a></li>
          <li><a href="/orders">Orders</a></li>
          <li><a href="/products">Products</a></li>
          <li><a href="/settings">Settings</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default DashboardHeader;
