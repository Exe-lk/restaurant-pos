import React from 'react';
import dynamic from 'next/dynamic';
import { demoPagesMenu, pageLayoutTypesPagesMenu } from '../menu';


const AdminAside = dynamic(() => import('../pages/_layout/_asides/AdminAside'));

const ViewAside = dynamic(() => import('../pages/_layout/_asides/KitchenAside'));
const CashierAside = dynamic(() => import('../pages/_layout/_asides/CashierAsider'));
const WaiterAside = dynamic(() => import('../pages/_layout/_asides/WaiterAsider'));
const BarAside = dynamic(() => import('../pages/_layout/_asides/BarAsider'));


const asides = [
	
	{ path: '/admin/*', element: <AdminAside/>, exact: true },
	{ path: '/bar/*', element: <BarAside/>, exact: true },

	{ path: '/cashier/*', element: <CashierAside/>, exact: true },
	{ path: '/kitchen/*', element: <ViewAside/>, exact: true },
	{ path: '/waiter/*', element: <WaiterAside/>, exact: true },

];

export default asides;
