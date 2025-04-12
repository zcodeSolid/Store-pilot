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
      <ui-nav-menu>
  <a href="/" rel="home">Home</a>
  <a href="/templates">Templates</a>
  <a href="/settings">Settings</a>
</ui-nav-menu>
    </header>
  );
};

export default DashboardHeader;
