import { Navbar } from "@/components/navbar";
import { LanguageProvider } from "@/contexts/language-context";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <Navbar />
      {children}
    </LanguageProvider>
  );
}
