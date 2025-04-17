import * as React from "react";
import { BaseEditor } from "~/components/base-editor";

type FieldType = 'text' | 'number' | 'textarea' | 'boolean' | 'date';

type FieldConfig = {
  type: FieldType;
  label: string;
  value: any;
  onChange: (value: any) => void;
  name: string;
};

type ListItemContentProps = {
  content: Record<string, FieldConfig>;
};

export const ListItemContent = ({ content }: ListItemContentProps) => {
  const renderField = (fieldName: string, config: FieldConfig) => {
    const field = {
      ...config,
      name: fieldName
    };
    return <BaseEditor field={field} />;
  };

  return (
    <div className="space-y-4">
      {Object.entries(content).map(([fieldName, config]) => (
        <React.Fragment key={fieldName}>
          {renderField(fieldName, config)}
        </React.Fragment>
      ))}
    </div>
  );
};

ListItemContent.displayName = "ListItemContent";