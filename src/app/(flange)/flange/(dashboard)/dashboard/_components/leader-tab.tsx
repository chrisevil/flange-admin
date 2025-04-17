import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartRender } from "~/components/ui/chart/ChartRender"; // Import ChartRender
import { type ChartConfig } from "~/components/ui/chart";

// Define the custom label renderer (adjust positioning for horizontal bars if needed)
const renderCustomBarLabel = ({ x, y, width, height, value }: any) => {
  // Position the label slightly to the right of the bar for horizontal layout
  const yPos = y + height / 2;
  const xPos = x + width + 5; // Position to the right

  // Basic styling
  return (
    <text x={xPos} y={yPos} fill="#666" textAnchor="start" dominantBaseline="middle" fontSize={12}>
      {value}
    </text>
  );
};

interface LeaderTabProps {
  leaderDataQuery: any;
}

export function LeaderTab({
  leaderDataQuery,
}: LeaderTabProps) {

  // Prepare data and config for ChartRender
  const chartData = (leaderDataQuery.data ?? []).slice(0, 10);
  const chartConfig: ChartConfig & Record<string, { visible: boolean }> = {
    overtimeHours: {
      label: "领导加班时长",
      color: "#8884d8",
      visible: true,
    },
    subordinatesAvgHours: {
      label: "团队平均加班时长",
      color: "#82ca9d",
      visible: true,
    },
  };

  return (
    <div className="space-y-6 pt-4">
      <Card>
        <CardHeader>
          <CardTitle>领导与团队加班对比</CardTitle>
          <CardDescription>领导加班时长与团队平均加班时长对比</CardDescription>
        </CardHeader>
         <CardContent>
           {/* Replace ResponsiveContainer and BarChart with ChartRender */}
           {/* Note: ChartRender currently renders horizontal bars. Adjust layout if needed. */}
           {/* The original chart was vertical. ChartRender might need adaptation or the layout expectation changes. */}
           <ChartRender
             chartData={chartData}
             chartConfig={chartConfig}
             chartType="bar"
             xAxisKey="name" // Use name for X-axis categories
             renderCustomBarLabel={renderCustomBarLabel} // Add custom label renderer
           />
         </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>领导加班详细数据</CardTitle>
          <CardDescription>领导与团队加班情况对比详细数据</CardDescription>
        </CardHeader>
         <CardContent>
           <div className="overflow-x-auto">
             <table className="w-full table-auto">
               <thead>
                 <tr className="border-b">
                   <th className="px-4 py-2 text-left">姓名</th>
                   <th className="px-4 py-2 text-left">公司</th>
                   <th className="px-4 py-2 text-left">部门</th>
                   <th className="px-4 py-2 text-left">职位</th>
                   <th className="px-4 py-2 text-left">领导加班时长(小时)</th>
                   <th className="px-4 py-2 text-left">团队平均加班时长(小时)</th>
                   <th className="px-4 py-2 text-left">差值(小时)</th>
                 </tr>
               </thead>
               <tbody>
                 {(leaderDataQuery.data ?? []).map((item: any, index: number) => (
                   <tr key={index} className="border-b">
                     <td className="px-4 py-2">{item.name}</td>
                     <td className="px-4 py-2">{item.company}</td>
                     <td className="px-4 py-2">{item.department}</td>
                     <td className="px-4 py-2">{item.title}</td>
                     <td className="px-4 py-2">{item.overtimeHours}</td>
                     <td className="px-4 py-2">{item.subordinatesAvgHours}</td>
                     <td className={`px-4 py-2 ${item.difference < 0 ? 'text-red-500' : 'text-green-500'}`}>
                       {item.difference > 0 ? `+${item.difference}` : item.difference}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </CardContent>
      </Card>
    </div>
  );
}