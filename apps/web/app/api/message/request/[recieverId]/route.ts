import { client } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOption } from "@repo/utils/src/authOption";

export async function POST(
   req: Request,
   { params }: { params: { reciverId: string } },
) {
   const session = await getServerSession(authOption);
   const recieverId = params.reciverId;
   const body = await req.json();
   const { content } = body;

   if (!session || !session.user) {
      return Response.json(
         {
            message: "Unauthorized access",
         },
         { status: 401 },
      );
   } else if (!recieverId) {
      return Response.json(
         {
            message: "Not a valid a user",
         },
         { status: 400 },
      );
   }

   const userId = session.user.id;

   try {
      const request = await client.messageRequest.create({
         data: {
            senderId: userId,
            recieverId,
            content,
         },
      });

      return Response.json(
         {
            data: request,
         },
         { status: 201 },
      );
   } catch (err) {
      return Response.json(
         {
            message: err,
         },
         { status: 500 },
      );
   }
}
