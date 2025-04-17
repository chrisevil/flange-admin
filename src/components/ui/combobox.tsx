"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export type ComboboxOption = {
  value: string;
  label: string;
};

interface ComboboxProps {
  options: ComboboxOption[];
  value: ComboboxOption | ComboboxOption[];
  onChange: (value: ComboboxOption | ComboboxOption[]) => void;
  placeholder: string;
  emptyMessage: string;
  isMulti?: boolean;
}

export function Combobox({
  options = [],
  value = isMulti ? [] : undefined,
  onChange,
  placeholder,
  emptyMessage,
  isMulti = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const validOptions = Array.isArray(options) ? options : [];

  const handleSelect = (selectedValue: ComboboxOption) => {
    if (isMulti) {
      if (
        Array.isArray(value) &&
        value.some((v) => v.value === selectedValue.value)
      ) {
        onChange(
          (value as ComboboxOption[]).filter(
            (v) => v.value !== selectedValue.value,
          ),
        );
      } else {
        onChange([...(value as ComboboxOption[]), selectedValue]);
      }
    } else {
      onChange(selectedValue);
      setOpen(false);
    }
  };

  const SelectedItem = ({ label, value }: { label: string; value: string }) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-1">
      <span
        className="mr-1 text-gray-500 hover:text-gray-700 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const option = options.find(opt => opt.value === value);
          if (option) handleSelect(option);
        }}
        role="button"
      >
        ×
      </span>
      {label}
    </span>
  );

  const displayValue = isMulti
    ? (value as ComboboxOption[]).length > 0
      ? (value as ComboboxOption[]).map((val) => (
        <SelectedItem key={val.value} label={val.label} value={val.value} />
      ))
      : placeholder
    : (value as ComboboxOption)?.label || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {displayValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`搜索${placeholder.toLowerCase()}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {validOptions.length > 0 ? (
                validOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSelect(option)}
                    className="text-sm"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${Array.isArray(value) && value.some((v) => v.value === option.value) ? "opacity-100" : "opacity-0"}`}
                    />
                    {option.label}
                  </CommandItem>
                ))
              ) : (
                <div className="text-sm py-1.5 px-2">{emptyMessage}</div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
