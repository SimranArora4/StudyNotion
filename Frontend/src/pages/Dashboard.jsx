import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from "react-router-dom";
import Sidebar from '../components/core/Dashboard/Sidebar';
import Loading from '../components/common/Loading';

const Dashboard = () => {
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { loading: profileLoading } = useSelector((state) => state.profile);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (profileLoading || authLoading) {
    return (
      <div className='mt-10'>
        <Loading />
      </div>
    );
  }

  return (
    <div className='relative flex min-h-[calc(100vh-3.5rem)] overflow-auto'>
      <div className='sticky top-0'> <Sidebar /></div>
     
      <div className='h-[calc(100vh-3.5rem)] w-full'>
        <div className='p-10'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
