import LoginHeader from "@/components/LoginHeader";
import Script from "next/script";

export default function PricingLayout({ children }) {
  return (
    <>
      <LoginHeader />
      {children}
      <Script
    id="razorpay-checkout-js"
    src="https://checkout.razorpay.com/v1/checkout.js"
   />
    </>
  );
}
