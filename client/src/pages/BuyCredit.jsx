import React, { useContext } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const BuyCredit = () => {
  const {
    user,
    token,
    backendUrl,
    loadCreditsData,
    setShowLogin,
  } = useContext(AppContext);

  // ===============================
  // 🔥 RAZORPAY FLOW
  // ===============================
  const handleBuyCredits = async (plan) => {
    if (!token) {
      setShowLogin(true);
      return;
    }

    try {
      // 1️⃣ Create order from backend
      const { data } = await axios.post(
        `${backendUrl}/api/payment/create-order`,
        {
          amount: plan.price,
          credits: plan.credits,
        },
        {
          headers: { token },
        }
      );

      if (!data.success) {
        toast.error("Failed to create payment order");
        return;
      }

      const order = data.order;

      // 2️⃣ Razorpay checkout options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Imagify",
        description: `${plan.credits} Credits Purchase`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3️⃣ Verify payment
            const verifyRes = await axios.post(
              `${backendUrl}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                credits: plan.credits,
              },
              {
                headers: { token },
              }
            );

            if (verifyRes.data.success) {
              toast.success("Credits added successfully 🎉");
              loadCreditsData();
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            toast.error("Error verifying payment");
          }
        },
        prefill: {
          name: user?.name || "Imagify User",
          email: user?.email || "",
        },
        theme: {
          color: "#1f2937",
        },
      };

      // 4️⃣ Open Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong with payment");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="min-h-[80vh] text-center pt-14 mb-10"
    >
      <h1 className="text-3xl font-medium mb-4">
        Choose Your Plan
      </h1>

      <p className="text-gray-500 mb-12">
        Flexible credit plans designed for creators and innovators
      </p>

      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item, index) => (
          <div
            key={index}
            className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500"
          >
            <img width={40} src={assets.logo_icon} alt="" />

            <p className="mt-3 mb-1 font-semibold">{item.id}</p>
            <p className="text-sm">{item.desc}</p>

            <p className="mt-6">
              <span className="text-3xl font-medium">
                ₹{item.price}
              </span>
              <span className="text-gray-500">
                {" "} / {item.credits} Credits
              </span>
            </p>

            <p className="text-xs text-gray-400 mt-2">
              Includes complimentary starter credits
            </p>

            <button
              onClick={() => handleBuyCredits(item)}
              className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52"
            >
              {user ? "Buy Credits" : "Login to Continue"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuyCredit;
