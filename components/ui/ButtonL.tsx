import React from 'react';
import Link from 'next/link';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  href,
  className = '',
  onClick,
  type = 'button',
}) => {
  // Styles based on variant
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-cyan-400 hover:bg-cyan-500 text-black';
      case 'secondary':
        return 'bg-transparent hover:bg-gray-700/50 text-cyan-400 border border-cyan-400';
      case 'tertiary':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      default:
        return 'bg-cyan-400 hover:bg-cyan-500 text-black';
    }
  };

  // Base button classes
  const baseClasses = 'font-medium py-2 px-8 rounded-full transition-colors duration-300 text-sm';
  const buttonClasses = `${baseClasses} ${getVariantClasses()} ${className}`;

  // Render as link if href is provided
  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;