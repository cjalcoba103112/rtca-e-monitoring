import { Input } from "antd";
import { useRef } from "react";

type DebounceInputProps = {
  onChange?: (value: string) => void;
  delay?: number;
  placeholder?: string;
  style?: React.CSSProperties;
  allowClear?: boolean;
};

export default function DebounceInput({
  onChange,
  delay = 300,
  placeholder,
  style,
  allowClear = true,
}: DebounceInputProps) {
  const timerRef = useRef<any | null>(null);

  const handleChange = (value: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onChange?.(value);
    }, delay);
  };

  return (
    <Input
      placeholder={placeholder}
      style={style}
      allowClear={allowClear}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}