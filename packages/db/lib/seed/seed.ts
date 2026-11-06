import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "@workspace/db";

const CHAT_ID = "demo_chat_alice_bob";

async function main() {
    const [alicePassword, bobPassword] = await Promise.all([
        bcrypt.hash("Alice123!", 10),
        bcrypt.hash("Bob123!", 10),
    ]);

    const alice = await prisma.user.upsert({
        where: { username: "alice" },
        create: {
            id: "demo_alice",
            username: "alice",
            email: "alice@example.com",
            password: alicePassword,
        },
        update: {
            password: alicePassword,
        },
        select: { id: true },
    });

    const bob = await prisma.user.upsert({
        where: { username: "bob" },
        create: {
            id: "demo_bob",
            username: "bob",
            email: "bob@example.com",
            password: bobPassword,
        },
        update: {
            password: bobPassword,
        },
        select: { id: true },
    });

    const chat = await prisma.chat.upsert({
        where: { id: CHAT_ID },
        create: {
            id: CHAT_ID,
            name: "Alice & Bob",
            type: "SINGLE",
        },
        update: {},
    });

    // Ensure both users are members.
    for (const userId of [alice.id, bob.id]) {
        const membership = await prisma.chatMembers.findFirst({
            where: {
                userId,
                chatId: chat.id,
            },
        });

        if (!membership) {
            await prisma.chatMembers.create({
                data: {
                    userId,
                    chatId: chat.id,
                },
            });
        }
    }

    console.log("Seeding completed.");
    console.log("Alice: alice / Alice123!");
    console.log("Bob: bob / Bob123!");
    console.log("Chat ID:", chat.id);
}

main()
    .catch((error: unknown) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
