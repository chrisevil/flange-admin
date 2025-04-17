"use client";

import { type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { cn } from "~/lib/utils";

interface DataTableCardProps<T> {
  title: string;
  description?: string;
  data: T[];
  columns: {
    key: keyof T;
    title: string;
    render?: (value: any, item: T) => ReactNode;
  }[];
  className?: string;
  maxItems?: number;
  onRowClick?: (item: T) => void;
}

export function DataTableCard<T extends Record<string, any>>({ 
  title, 
  description, 
  data, 
  columns, 
  className,
  maxItems = 5,
  onRowClick
}: DataTableCardProps<T>) {
  const displayData = maxItems ? data.slice(0, maxItems) : data;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key.toString()}>
                    {column.title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.length > 0 ? (
                displayData.map((item, index) => (
                  <TableRow 
                    key={index} 
                    onClick={() => onRowClick?.(item)}
                    className={onRowClick ? "cursor-pointer hover:bg-muted/50" : undefined}
                  >
                    {columns.map((column) => (
                      <TableCell key={`${index}-${column.key.toString()}`}>
                        {column.render
                          ? column.render(item[column.key], item)
                          : item[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    暂无数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}