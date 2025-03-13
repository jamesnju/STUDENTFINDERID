import { getAllPayments } from '@/actions/payments';
import Payment from '@/components/payment/Payment'
import React from 'react'

const page = async() => {
      const payments = await getAllPayments() || [];

  return (
    <div>
        <Payment payments={payments}/>
    </div>
  )
}

export default page