import React, { useContext } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from 'motion/react'
import { toast } from 'react-toastify'
import axios from 'axios'
const BuyCredit = () => {
  const {user, backendUrl, token, setShowLogin, getCreditBalance} = useContext(AppContext);
  const paymentHandler = async (planId) => {
    try {
      if (!token || !user){
        setShowLogin(true);
        toast.info("Please login to buy credits!")
      }
      const {data} = await axios.post(backendUrl+"/api/user/razorpay",{planId},{headers:{token}});
      if (!data || !(data?.order)){
        toast.error('Server error. Are you online?');
      }else{
        console.log(data);
        const { amount, id: order_id, currency } = data.order;
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
            amount: amount.toString(),
            currency: currency,
            name: "Aamir Corp.",
            description: "Test Transaction",
            order_id: order_id,
            handler: async function (response) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };

                const result = await axios.post(backendUrl+'/api/user/verify-payment', data,{headers:{token}});
                // console.log(result);
                getCreditBalance();
                toast.success(result.data.message);
            },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message)
    }
  }
  return (
    <motion.div 
    initial={{opacity:0.2,y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1,y:0}}
    viewport={{once:true}}
    className='min-h-[80vh] text-center pt-14 mb-10'>
      <button className='border border-gray-400 px-10 py-2 rounded-full mb-6'>Our Plans</button>
      <h1 className='text-center text-3xl font-medium mb-6 sm:mb-10'>Choose the plan</h1>
      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {
          plans.map((item,index)=>(
            <div key={index} className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500'>
              <img width={40} src={assets.logo_icon} alt="" />
              <p className="mt-3">{item.id}</p>
              <p className="text-sm">{item.desc}</p>
              <p className='mt-6'><span className='text-3xl font-medium'>${ item.price } </span>/ { item.credits } credits</p>
              <button onClick={()=>paymentHandler(item.id)} className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52'>{user ? "Purchase" : "Get Started"}</button>
            </div>
          ))
        }
      </div>
    </motion.div>
  )
}

export default BuyCredit