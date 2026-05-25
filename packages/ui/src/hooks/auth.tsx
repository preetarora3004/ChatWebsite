import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function useAuthGuard() {
   const { status } = useSession();

   useEffect(() => {
      if (status === "authenticated") {
         return;
      }
   }, [status]);

   return { status };
}
