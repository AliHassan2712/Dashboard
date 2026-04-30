"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import { DashboardStats } from '@/src/types'; 

export function DashboardCharts({ data }: { data: DashboardStats['chartData'] }) {
  return (
    <div className="bg-app-card-light dark:bg-app-card-dark p-6 rounded-2xl border border-app-border-light dark:border-app-border-dark shadow-sm">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h3 className="font-bold flex items-center gap-2 text-app-text-primary-light dark:text-app-text-primary-dark">
          <Activity className="w-5 h-5 text-brand-500 dark:text-brand-400" /> نشاط الورشة (آخر 7 أيام)
        </h3>
      </div>
      
      <div className="h-72 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip 
              cursor={{fill: '#f3f4f6'}} 
              contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', textAlign: 'right'}} 
            />
            <Bar dataKey="التذاكر" fill="#4f46e5" radius={[6, 6, 0, 0]} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}