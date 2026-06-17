import { useEffect } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") {
      router.replace("/admin");
    }
  }, [router]);
  return null;
}
