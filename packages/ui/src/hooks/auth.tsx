import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function useAuthGuard(loadUser: () => Promise<void>) {
   const { status } = useSession();

   useEffect(() => {
      if (status === "authenticated") {
         loadUser();
      }
   }, [status, loadUser]);

   return { status };
}

