import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import dashboardService from '../services/dashboard'; // Ensure this service is implemented

const SessionOverview = () => {
  const { sessionStartTime, user } = useStore((state) => state);
  const [sessionLogs, setSessionLogs] = useState<any[]>([]);
  const sessionDuration = sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000 / 60) : 0; // in minutes

  useEffect(() => {
    const fetchSessionLogs = async () => {
      if (user) {
        const logs = await dashboardService.getSessionLogs(user._id); // Fetch session logs
        setSessionLogs(logs);
      }
    };

    fetchSessionLogs();
  }, [user]);

  const data = [
    { name: 'Active Time', value: sessionDuration },
    { name: 'Idle Time', value: 60 - sessionDuration }, // Assuming a total of 60 minutes for simplicity
  ];

  // Prepare data for line chart
  const lineChartData = sessionLogs.map(log => ({
    time: new Date(log.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: log.duration, // Assuming duration is stored in minutes
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">Resumen de Sesión</h2>
      <p className="mt-4">Tiempo en la plataforma: {sessionDuration} minutos</p>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Distribución de Tiempo</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={data}
              cx={150}
              cy={150}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#82ca9d' : '#ff6384'} />
              ))}
            </Pie>
            <RechartsTooltip />
          </PieChart>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Actividad a lo Largo del Tiempo</h3>
          <LineChart width={300} height={200} data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <RechartsTooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default SessionOverview; 