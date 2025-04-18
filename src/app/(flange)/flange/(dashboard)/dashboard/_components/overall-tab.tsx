import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";

interface OverallTabProps {
  unitCategoriesDataQuery: any;
  COLORS: string[];
}

export function OverallTab({
  unitCategoriesDataQuery,
  COLORS,
}: OverallTabProps) {
  return (
    <div className="space-y-6 pt-4">
      {(unitCategoriesDataQuery.data ?? []).map((category, categoryIndex) => (
        <Card key={category.categoryKey} className="mb-6">
          <CardHeader>
            <CardTitle>{category.categoryName}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">序号</TableHead>
                    <TableHead>单位名称</TableHead>
                    <TableHead>员工数量</TableHead>
                    <TableHead>月加班总时长(小时)</TableHead>
                    <TableHead>人均月加班时长(小时)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {category.groups.map((group, index) => (
                    <TableRow key={`${category.categoryKey}-${index}`}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{group.name}</TableCell>
                      <TableCell>{group.employeeCount}</TableCell>
                      <TableCell>
                        <span style={{ color: COLORS[categoryIndex % COLORS.length] }}>
                          {group.totalOvertimeHours.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: COLORS[(categoryIndex + 2) % COLORS.length] }}>
                          {group.avgOvertimeHours.toFixed(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}