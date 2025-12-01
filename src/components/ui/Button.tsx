import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ className, ...props }: ButtonProps) => {
  return (
    <button
      className={`bg-zinc-900 text-white font-bold py-2 px-4 rounded hover:bg-zinc-800 transition-colors ${className}`}
      {...props}
    />
  );
};
