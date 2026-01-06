
import { DarkmodeToggle } from "@/components/common/darkmode-toggle";
import { Coffee } from "lucide-react";
import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative bg-muted flex min-h-svh flex-col p-6 gap-6 md:10 items-center justify-center">
      <div className="absolute top-4 right-4">
        <DarkmodeToggle />
      </div>

      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="bg-pink-500 flex items-center justify-center p-2 rounded-md">
            <Coffee />
          </div>
          | Maid Cafe
        </div>
      </div>

      {children}
    </div>
  );
}
