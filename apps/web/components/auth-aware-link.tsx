"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "~/hooks/api/auth";
import Link from "next/link";


export function AuthAwareLink({
  href,
  children,
  className,
  style,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const router = useRouter();
  const { user, isLoading } = useUser() as any;

  const handleClick = (e: React.MouseEvent) => {
    if (!isLoading && user?.id) {
      e.preventDefault();
      router.push("/dashboard");
    }
  };

  return (
    <Link href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </Link>
  );
}


export function AuthLoadingScreen({ message = "Verifying session..." }: { message?: string }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#F9F8F4]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: "#111111 transparent transparent transparent" }} />
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
}


export function RedirectIfAuthenticated({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isFetched } = useUser() as any;

  useEffect(() => {
    if (isFetched && user?.id) {
      router.replace("/dashboard");
    }
  }, [user, isFetched, router]);

  if (!isFetched || isLoading || user?.id) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}


export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isFetched } = useUser() as any;

  useEffect(() => {
    if (isFetched && !user?.id) {
      router.replace("/login");
    }
  }, [user, isFetched, router]);

  if (!isFetched || isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!user?.id) {
    return null;
  }

  return <>{children}</>;
}
