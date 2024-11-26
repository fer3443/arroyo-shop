"use client"

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { CreateOrderActions, CreateOrderData, OnApproveActions, OnApproveData } from "@paypal/paypal-js"
import { paypalCheckPayment, setTransactionId } from "@/actions";

interface Props {
  orderId:string;
  amount: number;
}

export const PaypalButton = ({orderId, amount}:Props) => {

  const roundedAmount = (Math.round(amount * 100))/100

  const [{ isPending }] = usePayPalScriptReducer();

  const createOrder = async (data:CreateOrderData, action:CreateOrderActions):Promise<string> => {
    const transactionId = await action.order.create({
      intent:'CAPTURE',
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            currency_code:'USD',
            value:`${roundedAmount}`
          }
        }
      ]
    })
    console.log({transactionId})

    const {ok} = await setTransactionId(orderId, transactionId)
    if(!ok){
      throw new Error('No se pudo actualizar la orden')
    }

    
    return transactionId
  }

  const onApprove = async (data:OnApproveData, action:OnApproveActions) => {
    const details = await action.order?.capture();
    if(!details) return
    await paypalCheckPayment(details.id!)
  }
  
  if(isPending) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-300 rounded"/>
        <div className="h-12 mt-2 bg-gray-300 rounded"/>
      </div>
    )
  }

  return (
    <PayPalButtons
      createOrder={createOrder}
      onApprove={ onApprove }
    />
  )
}
