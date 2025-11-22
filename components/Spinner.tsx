import React from 'react';

export const Spinner: React.FC = () => (
  <div className="flex justify-center items-center space-x-2 p-8">
    <div className="w-3 h-3 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-3 h-3 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-3 h-3 bg-brand-500 rounded-full animate-bounce"></div>
  </div>
);
