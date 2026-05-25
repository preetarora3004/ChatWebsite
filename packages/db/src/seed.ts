import { client } from "./index.ts";

const prisma = client;

async function main() {

   const preet = await prisma.user.create({
      data: {
         username: "preet",
         hashedPassword: "1234",
      },
   });

   const rahul = await prisma.user.create({
      data: {
         username: "rahul",
         hashedPassword: "1234",
      },
   });

   const aman = await prisma.user.create({
      data: {
         username: "aman",
         hashedPassword: "1234",
      },
   });

   const rohit = await prisma.user.create({
      data: {
         username: "rohit",
         hashedPassword: "1234",
      },
   });


   const chat1 = await prisma.chat.create({
      data: {
         isGroupChat: false,

         participants: {
            create: [
               {
                  userId: preet.id,
               },
               {
                  userId: rahul.id,
               },
            ],
         },
      },
   });

   const chat2 = await prisma.chat.create({
      data: {
         isGroupChat: false,

         participants: {
            create: [
               {
                  userId: preet.id,
               },
               {
                  userId: aman.id,
               },
            ],
         },
      },
   });

   const chat3 = await prisma.chat.create({
      data: {
         isGroupChat: false,

         participants: {
            create: [
               {
                  userId: rahul.id,
               },
               {
                  userId: rohit.id,
               },
            ],
         },
      },
   });



   await prisma.message.createMany({
      data: [
         {
            content: "Hey Rahul 👋",
            senderId: preet.id,
            chatId: chat1.id,
         },
         {
            content: "Hello Preet!",
            senderId: rahul.id,
            chatId: chat1.id,
         },
         {
            content: "What are you working on?",
            senderId: preet.id,
            chatId: chat1.id,
         },
         {
            content: "Building a Next.js app currently.",
            senderId: rahul.id,
            chatId: chat1.id,
         },
         {
            content: "Nice, using Prisma?",
            senderId: preet.id,
            chatId: chat1.id,
         },
         {
            content: "Yeah with PostgreSQL.",
            senderId: rahul.id,
            chatId: chat1.id,
         },
         {
            content: "That's awesome",
            senderId: preet.id,
            chatId: chat1.id,
         },
      ],
   });

   // PREET <-> AMAN

   await prisma.message.createMany({
      data: [
         {
            content: "Hi Aman!",
            senderId: preet.id,
            chatId: chat2.id,
         },
         {
            content: "Hey bro 🤡",
            senderId: aman.id,
            chatId: chat2.id,
         },
         {
            content: "Did you complete the assignment?",
            senderId: preet.id,
            chatId: chat2.id,
         },
         {
            content: "Almost done.",
            senderId: aman.id,
            chatId: chat2.id,
         },
         {
            content: "Need any help?",
            senderId: preet.id,
            chatId: chat2.id,
         },
         {
            content: "Maybe with DBMS queries.",
            senderId: aman.id,
            chatId: chat2.id,
         },
         {
            content: "Sure, send them over.",
            senderId: preet.id,
            chatId: chat2.id,
         },
      ],
   });

   // RAHUL <-> ROHIT

   await prisma.message.createMany({
      data: [
         {
            content: "Yo Rohit!",
            senderId: rahul.id,
            chatId: chat3.id,
         },
         {
            content: "What's up Rahul?",
            senderId: rohit.id,
            chatId: chat3.id,
         },
         {
            content: "Learning WebSockets today.",
            senderId: rahul.id,
            chatId: chat3.id,
         },
         {
            content: "Realtime chat app?",
            senderId: rohit.id,
            chatId: chat3.id,
         },
         {
            content: "Exactly 😂",
            senderId: rahul.id,
            chatId: chat3.id,
         },
         {
            content: "That's going to be fun.",
            senderId: rohit.id,
            chatId: chat3.id,
         },
         {
            content: "Will deploy it soon.",
            senderId: rahul.id,
            chatId: chat3.id,
         },
      ],
   });


   await prisma.lastSeen.createMany({
      data: [
         {
            userId: preet.id,
            time: new Date(),
         },
         {
            userId: rahul.id,
            time: new Date(),
         },
         {
            userId: aman.id,
            time: new Date(),
         },
         {
            userId: rohit.id,
            time: new Date(),
         },
      ],
   });

   console.log("Seeded successfully");
}

main()
   .catch((e) => {
      console.error(e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });
