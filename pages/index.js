import Layout from '@/components/Layout'
import MongooseConnect from '@/lib/mongoose';
import { Order } from '@/models/Order';
import {signOut, useSession } from 'next-auth/react'
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';


export default function Home({dailyOrders, weeklyOrders, monthlyOrders, dailyRevenue, weeklyRevenue, monthlyRevenue}) {
  const {data:session} = useSession() ;
  const userImg = session?.user?.image;
  const [currWidth, setCurrWidth]  = useState();

  useEffect(()=> {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setCurrWidth(window.innerWidth); // 768px corresponds to 'md' breakpoint in Tailwind
      }
    };

    // Initial check
    handleResize();

    // Add event listener for resizing
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  },[]);

  return (
    <>
      <Layout>
        <div className="flex gap-1 justify-end items-center">
          <div className='flex gap-2 items-center font-mono bg-gray-300 p-1 px-2 rounded-full text-nowrap overflow-hidden' >
            <Image src={userImg} height={30} width={30} alt='userImg' quality={100} className='rounded-full object-cover'/>
            {currWidth <= 425 ? session?.user?.name.split(' ')[0] : session?.user?.name}
          </div>
        </div>
        <div className='pt-4'>
          <h1>Orders</h1>
          <div className=' grid py-4 grid-cols-1 gap-4 md:grid-cols-3 align-middle justify-center md:gap-10'>
            <div className='dashboardBox'>
              <p>Today</p>
              <h3>{dailyOrders}</h3>
              <p className='sub'>{dailyOrders} orders today</p>
            </div>
            <div className='dashboardBox'>
              <p>Weekly</p>
              <h3>{weeklyOrders}</h3>
              <p className='sub'>{weeklyOrders} orders this week</p>
            </div>
            <div className='dashboardBox'>
              <p>Monthly</p>
              <h3>{monthlyOrders}</h3>
              <p className='sub'>{monthlyOrders} orders This Month</p>
            </div>
          </div>
        </div>
        <div className='pt-4 md:pt-16'>
          <h1>Revenue</h1>
          <div className=' grid py-4 grid-cols-1 gap-4 md:grid-cols-3 align-middle justify-center md:gap-10'>
            <div className='dashboardBox'>
              <p>Today</p>
              <h3>${dailyRevenue}</h3>
              <p className='sub'>${dailyRevenue} Revenue today</p>
            </div>
            <div className='dashboardBox'>
              <p>This Week</p>
              <h3>${weeklyRevenue}</h3>
              <p className='sub'>${weeklyRevenue} Revenue this week</p>
            </div>
            <div className='dashboardBox'>
              <p>This Month</p>
              <h3>${monthlyRevenue}</h3>
              <p className='sub'>${monthlyRevenue} Revenue This Month</p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(){
  await MongooseConnect();
  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setUTCHours(0, 0, 0, 0);
  console.log("day : ", startOfDay);

  const startOfWeek = new Date(now);
  const dayOfWeek = startOfWeek.getUTCDay();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek -1;
  startOfWeek.setUTCDate(startOfWeek.getUTCDate() - diffToMonday);
  startOfWeek.setUTCHours(0, 0, 0, 0);
  console.log("week : ", startOfWeek);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
  endOfWeek.setUTCHours(23, 59, 59, 999);

  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),1));

  async function getOrdersRevenue(startOfTime){
    let revenue = 0;
    const orders = await Order.find({
      createdAt: {
        $gte: startOfTime,
      }
    });

    orders.forEach(order => {
      order.line_items.forEach(item => {
        revenue += item.price_data.unit_amount;
      });
    } );

    return revenue ;
  }

  const dailyOrders = await Order.countDocuments({
    createdAt: {
      $gte: startOfDay,
    }
  })

  const weeklyOrders = await Order.countDocuments({
    createdAt: {
      $gte: startOfWeek,
      $lt: endOfWeek
    }
  })
  const monthlyOrders = await Order.countDocuments({
    createdAt: {
      $gte: startOfMonth,
    }
  })

  let dailyRevenue = await getOrdersRevenue(startOfDay);
  let weeklyRevenue = await getOrdersRevenue(startOfWeek);
  let monthlyRevenue = await getOrdersRevenue(startOfMonth);

    return {
      props: {
        dailyOrders:JSON.parse(JSON.stringify(dailyOrders)) || 0,
        weeklyOrders:JSON.parse(JSON.stringify(weeklyOrders)) || 0,
        monthlyOrders:JSON.parse(JSON.stringify(monthlyOrders)) || 0,
        dailyRevenue: JSON.parse(JSON.stringify(dailyRevenue/100)) || 0,
        weeklyRevenue: JSON.parse(JSON.stringify(weeklyRevenue/100)) || 0,
        monthlyRevenue: JSON.parse(JSON.stringify(monthlyRevenue/100)) || 0,
      }
    }
}