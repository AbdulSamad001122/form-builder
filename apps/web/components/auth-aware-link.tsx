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


export function RedirectIfAuthenticated() {
  const router = useRouter();
  const { user, isLoading } = useUser() as any;

  useEffect(() => {
    if (!isLoading && user?.id) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  return null;
}
