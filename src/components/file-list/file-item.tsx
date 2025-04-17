"use client";

import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";

export interface FileItemProps {
  filename: string;
  isSelected: boolean;
  onToggle: () => void;
}

export function FileItem({ filename, isSelected, onToggle }: FileItemProps) {
  return (
    <li className="flex items-center space-x-2">
      <Checkbox
        id={`file-${filename}`}
        checked={isSelected}
        onCheckedChange={onToggle}
        className="h-4 w-4"
      />
      <Label
        htmlFor={`file-${filename}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
      >
        {filename}
      </Label>
    </li>
  );
}