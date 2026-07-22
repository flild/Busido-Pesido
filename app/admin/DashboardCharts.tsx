// app/admin/DashboardCharts.tsx
'use client';

import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

export default function DashboardCharts({ 
  dynamics, 
  viewsDynamics, 
  services 
}: { 
  dynamics: any[], 
  viewsDynamics: any[], 
  services: any[] 
}) {
  const COLORS = ['#2F3F17', '#C68E6B', '#F07296', '#6F8FBF', '#E6DACF']; 

  return (
    <div className="grid grid-cols-3 gap-6 max-xl:grid-cols-2 max-md:grid-cols-1">
      
      {/* График динамики заявок */}
      <div className="bg-white border border-forest/15 rounded-[24px] p-8 shadow-sm flex flex-col">
        <h3 className="text-lg font-bold text-coal mb-6">Заявки (30 дней)</h3>
        {dynamics.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-coal/40 font-medium">Нет данных</div>
        ) : (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dynamics} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2F3F17" strokeOpacity={0.1} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#141414', opacity: 0.6 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#141414', opacity: 0.6 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(47,63,23,0.1)' }} />
                <Line type="monotone" dataKey="Заявки" stroke="#2F3F17" strokeWidth={3} dot={{ r: 4, fill: '#fff', stroke: '#2F3F17', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* НОВЫЙ График динамики просмотров */}
      <div className="bg-white border border-forest/15 rounded-[24px] p-8 shadow-sm flex flex-col">
        <h3 className="text-lg font-bold text-coal mb-6">Просмотры статей</h3>
        {viewsDynamics?.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-coal/40 font-medium">Нет данных</div>
        ) : (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsDynamics} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#6F8FBF" strokeOpacity={0.1} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#141414', opacity: 0.6 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#141414', opacity: 0.6 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(111,143,191,0.2)' }} />
                <Line type="monotone" dataKey="Просмотры" stroke="#6F8FBF" strokeWidth={3} dot={{ r: 4, fill: '#fff', stroke: '#6F8FBF', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* График распределения по услугам */}
      <div className="bg-white border border-forest/15 rounded-[24px] p-8 shadow-sm flex flex-col max-xl:col-span-2 max-md:col-span-1">
        <h3 className="text-lg font-bold text-coal mb-6">Популярные форматы</h3>
        {services.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-coal/40 font-medium">Нет заявок</div>
        ) : (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={services} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#2F3F17" strokeOpacity={0.1} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={120} tick={{ fontSize: 12, fill: '#141414', fontWeight: 600 }} />
                <Tooltip cursor={{ fill: 'rgba(47,63,23,0.03)' }} contentStyle={{ borderRadius: '12px', border: '1px solid rgba(47,63,23,0.1)' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                  {services.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
}