import * as React from "react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";

type ListControlsProps = {
  onAdd: () => void;
};

export const ListControls = ({ onAdd }: ListControlsProps) => {
  return (
    <div className="flex justify-end mt-4">
      <Button onClick={onAdd}>
        <Plus className="h-4 w-4 mr-2" />
        添加项目
      </Button>
    </div>
  );
};

ListControls.displayName = "ListControls";