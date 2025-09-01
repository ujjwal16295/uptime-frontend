import LoginHeader from "@/components/LoginHeader";

export default function TestLayout({ children }) {
  return (
    <>
      <LoginHeader />
      {children}
    </>
  );
}
