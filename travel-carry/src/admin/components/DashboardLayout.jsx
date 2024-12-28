import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
    return (
        <div className="flex">
            <Sidebar/>
            <div className="flex-1 p-8">
                <Outlet/> {/* Renders nested child routes */}
            </div>
        </div>
    );
};

export default DashboardLayout;
