import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  icon,
  children,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/30 backdrop-blur-lg p-6 rounded-xl shadow-xl ${className}`}
    >
      {(title || icon) && (
        <div className="flex items-center mb-4">
          {icon && <span className="text-red-600 mr-2">{icon}</span>}
          {title && <h2 className="text-xl font-bold text-gray-800">{title}</h2>}
        </div>
      )}
      {children}
    </motion.div>
  );
};