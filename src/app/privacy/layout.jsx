import LoginHeader from "@/components/LoginHeader";

export default function PrivacyLayout({ children }) {
  return (
    <>
      <LoginHeader />
      {children}
    </>
  );
}
