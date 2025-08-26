import LoginHeader from "@/components/LoginHeader";

export default function TermsLayout({ children }) {
  return (
    <>
      <LoginHeader />
      {children}
    </>
  );
}
