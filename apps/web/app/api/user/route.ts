import { authOption } from "@repo/utils/src/authOption";
import { client } from "@repo/db";
import { getServerSession } from "next-auth/next";

export async function GET() {
   const session = await getServerSession(authOption);

   if (!session || !session.user)
      return Response.json({ msg: "Unauthorized" }, { status: 401 });

   const user = await client.user.findMany({
      where: { id: { not: session.user.id } },
   });

   return Response.json({ users: user });
}
