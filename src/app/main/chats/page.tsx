import React from 'react'
import ChatApp from './pageview'
import { getAllPayments } from '@/actions/payments';

const page = async () => {
  const payments = await getAllPayments() || [];
  return (
    <div className='bg-white'><ChatApp payments={payments}/></div>
  )
}

export default page