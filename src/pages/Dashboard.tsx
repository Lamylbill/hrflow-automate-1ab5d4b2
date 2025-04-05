
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Employee } from '@/types/employee';
import { standardizeEmployee } from '@/utils/employeeFieldUtils';

const Dashboard = () => {
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [activeEmployees, setActiveEmployees] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Fetch total employee count
        const { count: totalCount, error: countError } = await supabase
          .from('employees')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (countError) throw countError;

        // Fetch active employees
        const { data: activeData, error: activeError } = await supabase
          .from('employees')
          .select('id')
          .eq('user_id', user.id)
          .eq('employment_status', 'Active');

        if (activeError) throw activeError;

        setEmployeeCount(totalCount || 0);
        setActiveEmployees(activeData?.length || 0);
        
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="p-6 dashboard">
      <h1 className="text-xl font-bold mb-6">Dashboard</h1>
      
      {isLoading ? (
        <div className="text-center py-8">Loading dashboard data...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Error loading dashboard: {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-base font-semibold text-gray-700 card-title">Total Employees</h3>
            <p className="text-2xl font-bold mt-2 card-number">{employeeCount}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-base font-semibold text-gray-700 card-title">Active Employees</h3>
            <p className="text-2xl font-bold mt-2 card-number">{activeEmployees}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-base font-semibold text-gray-700 card-title">On Leave</h3>
            <p className="text-2xl font-bold mt-2 card-number">{employeeCount - activeEmployees}</p>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <p className="text-gray-600">No recent activity to display.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
