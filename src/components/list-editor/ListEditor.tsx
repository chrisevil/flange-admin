import * as React from "react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ListItem } from "./ListItem";
import { ListControls } from "./ListControls";

type ListItem = {
  id: string;
  title: string;
  content: any;
  isExpanded?: boolean;
};

type ListEditorProps = {
  initialItems?: ListItem[];
  listId: string;
  debug?: boolean;
};

export const ListEditor = ({ initialItems = [], listId, debug = false }: ListEditorProps) => {
  const listAtom = React.useMemo(
    () => atomWithStorage<ListItem[]>(`list-editor-${listId}`, initialItems),
    [listId]
  );
  
  const [items, setItems] = useAtom(listAtom);

  const addItem = React.useCallback((customData?: Partial<ListItem>) => {
    const newItem: ListItem = {
      id: Date.now().toString(),
      title: `Item ${items.length + 1}`,
      content: {},
      isExpanded: true,
      ...customData
    };
    setItems([...items, newItem]);
  }, [items, setItems]);

  const removeItem = React.useCallback((id: string) => {
    setItems(items.filter(item => item.id !== id));
  }, [items, setItems]);

  return (
    <div className="list-editor">
      {/* {debug && (
        <div className="debug-info">
          <pre>{JSON.stringify(items, null, 2)}</pre>
        </div>
      )} */}
      
      <div className="list-items">
        {items.map(item => (
          <ListItem 
            key={item.id} 
            item={item} 
            onRemove={removeItem}
          />
        ))}
      </div>
      
      <ListControls onAdd={addItem} />
    </div>
  );
};

ListEditor.displayName = "ListEditor";