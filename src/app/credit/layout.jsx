import CreditHeader from "@/components/CreditHeader";

export default function CreditLayout({ children }) {
  return (
    <>
    <CreditHeader/>
      {children}
    </>
  );
}
