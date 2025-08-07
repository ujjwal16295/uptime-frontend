import LoginHeader from "@/components/LoginHeader";

export default function LoginLayout({ children }) {
  return (
    <>
      <LoginHeader />
      {children}
    </>
  );
}
