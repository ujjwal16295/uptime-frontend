import LoginHeader from "@/components/LoginHeader";

export default function ReportLayout({ children }) {
  return (
    <>
      <LoginHeader />
      {children}
    </>
  );
}
