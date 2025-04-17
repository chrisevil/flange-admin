import * as React from "react";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ListItemContent } from "./ListItemContent";

type ListItemProps = {
  item: {
    id: string;
    title: string;
    content: any;
    isExpanded?: boolean;
  };
  onRemove: (id: string) => void;
};

export const ListItem = ({ item, onRemove }: ListItemProps) => {
  const [isExpanded, setIsExpanded] = React.useState(item.isExpanded ?? false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="list-item border rounded-md mb-2 overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 bg-muted cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 mr-2" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-2" />
          )}
          <span className="font-medium">{item.title}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      {isExpanded && (
        <div className="p-4 bg-background">
          <ListItemContent content={item.content} />
        </div>
      )}
    </div>
  );
};

ListItem.displayName = "ListItem";