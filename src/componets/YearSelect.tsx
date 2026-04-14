import React from 'react';
import { Select, type SelectProps } from 'antd';

interface YearSelectProps extends SelectProps {
  startYear?: number;
  endYear?: number;
  // Optional: override the default year today
  defaultYear?: number; 
}

const YearSelect: React.FC<YearSelectProps> = ({ 
  startYear = 2010, 
  endYear = new Date().getFullYear() + 2, 
  value,
  onChange,
  ...props 
}) => {
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: endYear - startYear + 1 }, 
    (_, i) => endYear - i
  );

  const options = years.map(year => ({
    label: `${year}`,
    value: year,
  }));

  return (
    <Select
      {...props}
      options={options}
      // If no value is passed from parent, it uses the current year
      value={value ?? currentYear} 
      onChange={onChange}
      style={{ width: 120, ...props.style }}
    />
  );
};

export default YearSelect;