import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = ({ className, ...props }: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      className={`w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 ${className}`}
      {...props}
    />
  );
};
