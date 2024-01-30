import React from "react";
import { Priority } from "../api/types";

interface SelectProps {
  options: Priority[];
  value: Priority;
  onChange: (value: Priority) => void;
}

export const Select: React.FC<SelectProps> = ({ options, value, onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="" className="text-sm font-medium">
        Prioritas
      </label>
      <select
        id="priority"
        className="rounded-md bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 outline-none placeholder:text-gray-500"
        value={value}
        onChange={(e) => onChange(e.target.value as Priority)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
