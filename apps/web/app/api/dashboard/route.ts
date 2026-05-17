import { client } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOption } from "@repo/utils/src/authOption";

export async function GET(_: Request) {
   const session = await getServerSession(authOption);

   if (!session || !session.user)
      return Response.json({ message: "Unauthorized access" }, { status: 403 });

   const currentUserId = session.user.id;

   try {
      const chat = await client.chat.findMany({
         where: {
            participants: {
               some: { userId: currentUserId },
            },
         },

         include: {
            message: {
               orderBy: { createdAt: "desc" },
               take: 1,
            },

            participants: {
               where: {
                  NOT: {
                     userId: currentUserId,
                  },
               },
               include: {
                  user: {
                     select: {
                        id: true,
                        username: true,
                     },
                  },
               },
            },
         },
      });

      if (chat.length === 0) {
         return Response.json({ message: "No chat found" }, { status: 400 });
      }

      return Response.json(
         {
            chat: chat,
         },
         { status: 200 },
      );
   } catch (err) {
      return Response.json({ error: err }, { status: 500 });
   }
}
