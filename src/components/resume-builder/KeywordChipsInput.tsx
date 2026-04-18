"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type KeywordChipsInputProps = {
  label: string;
  value: string[];
  placeholder: string;
  disabled?: boolean;
  onChange: (next: string[]) => void;
};

export function KeywordChipsInput({
  label,
  value,
  placeholder,
  disabled,
  onChange,
}: KeywordChipsInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addChip = (raw: string) => {
    const cleaned = raw.trim();
    if (!cleaned) return;
    if (value.some((item) => item.toLowerCase() === cleaned.toLowerCase())) {
      setInputValue("");
      return;
    }

    onChange([...value, cleaned]);
    setInputValue("");
  };

  const removeChip = (chip: string) => {
    onChange(value.filter((item) => item !== chip));
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              addChip(inputValue);
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={disabled || !inputValue.trim()}
          onClick={() => addChip(inputValue)}
        >
          Add
        </Button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((chip) => (
            <Badge
              key={chip}
              variant="secondary"
              className="flex items-center gap-2"
            >
              {chip}
              <button
                type="button"
                aria-label={`Remove ${chip}`}
                disabled={disabled}
                onClick={() => removeChip(chip)}
                className="text-xs leading-none"
              >
                x
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
