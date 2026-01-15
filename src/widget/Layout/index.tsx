import { ChevronLeft } from "lucide-react";
import { Link, useLocation } from "react-router";

export function Layout({ children }: { children: React.ReactNode }) {
  const path = useLocation().pathname;

  const isDetailPage = path.includes("/detail");

  return (
    <>
      <header className="mb-4 h-[60px] border-b border-gray-200">
        <div className="mx-auto flex h-full max-w-lg items-center justify-between px-4 text-xl font-bold">
          {isDetailPage ? (
            <Link to="/">
              <ChevronLeft className="size-6" />
            </Link>
          ) : (
            <>오늘 날씨</>
          )}
        </div>
      </header>
      <div className="mx-auto flex min-h-screen w-full max-w-lg flex-col gap-4 overflow-y-auto px-4">{children}</div>
    </>
  );
}
