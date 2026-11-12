import bcrypt from "bcrypt";
import { ChatType } from "../../generated/prisma/enums";
import { prisma } from "../client";

type SeedMessage = readonly [sender: string, content: string];

type SeedConversation = {
    users: readonly [string, string];
    messages: readonly SeedMessage[];
};

// Users
const users = [
    { username: "john", email: "john@example.com" },
    { username: "alice", email: "alice@example.com" },
    { username: "bob", email: "bob@example.com" },
    { username: "emma", email: "emma@example.com" },
    { username: "charlie", email: "charlie@example.com" },
    { username: "sophia", email: "sophia@example.com" },
    { username: "david", email: "david@example.com" },
    { username: "olivia", email: "olivia@example.com" },
    { username: "james", email: "james@example.com" },
    { username: "mia", email: "mia@example.com" },
];

// One-to-one conversations
const conversations: SeedConversation[] = [
    {
        users: ["john", "alice"],
        messages: [
            ["john", "Hey Alice! How are you?"],
            ["alice", "I'm good! How about you?"],
            ["john", "Doing great. What are you up to?"],
            ["alice", "Just working on a project."],
            ["john", "Nice! What are you building?"],
            ["alice", "A real-time chat application."],
        ],
    },
    {
        users: ["john", "bob"],
        messages: [
            ["bob", "Hey John!"],
            ["john", "Hey Bob, what's up?"],
            ["bob", "Are we meeting tomorrow?"],
            ["john", "Yes, definitely!"],
        ],
    },
    {
        users: ["john", "emma"],
        messages: [
            ["john", "Did you complete the assignment?"],
            ["emma", "Almost done."],
            ["john", "Great! Let me know when you're done."],
        ],
    },
    {
        users: ["alice", "charlie"],
        messages: [
            ["alice", "Hey Charlie!"],
            ["charlie", "Hey Alice! Long time."],
            ["alice", "We should catch up sometime."],
        ],
    },
    {
        users: ["alice", "sophia"],
        messages: [
            ["sophia", "Are you free this weekend?"],
            ["alice", "Yes, what's the plan?"],
            ["sophia", "Let's go for coffee!"],
        ],
    },
    {
        users: ["bob", "david"],
        messages: [
            ["bob", "Did you check the latest update?"],
            ["david", "Yes, looks good to me."],
            ["bob", "Great, let's merge it."],
        ],
    },
    {
        users: ["emma", "olivia"],
        messages: [
            ["emma", "Can you review my code?"],
            ["olivia", "Sure, send it over."],
            ["emma", "Just sent it!"],
            ["olivia", "I'll check it tonight."],
        ],
    },
    {
        users: ["charlie", "james"],
        messages: [
            ["charlie", "Are you joining the call?"],
            ["james", "Yes, give me 5 minutes."],
        ],
    },
    {
        users: ["sophia", "mia"],
        messages: [
            ["sophia", "Hey Mia!"],
            ["mia", "Hey! How have you been?"],
            ["sophia", "Pretty good. What about you?"],
        ],
    },
    {
        users: ["david", "james"],
        messages: [
            ["david", "Let's discuss the project."],
            ["james", "Sure, when are you available?"],
            ["david", "Tomorrow afternoon works."],
        ],
    },
];

async function main() {
    // Clear existing data (development only)
    await prisma.message.deleteMany();
    await prisma.chatMembers.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.lastSeen.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash("password123", 10);

    // Map username -> userId
    const userMap = new Map<string, string>();

    // Create users
    for (const user of users) {
        const createdUser = await prisma.user.create({
            data: {
                ...user,
                password: hashedPassword,
                lastSeen: {
                    create: {
                        lastOnline: Math.floor(Date.now() / 1000),
                    },
                },
            },
        });

        userMap.set(user.username, createdUser.id);
    }

    // Create conversations
    for (const conversation of conversations) {
        const chat = await prisma.chat.create({
            data: {
                type: ChatType.SINGLE,

                chatMembers: {
                    create: conversation.users.map((username) => {
                        const userId = userMap.get(username);

                        if (!userId) {
                            throw new Error(`User not found: ${username}`);
                        }

                        return { userId };
                    }),
                },
            },
        });

        // Create messages in chronological order
        for (const [sender, content] of conversation.messages) {
            const senderId = userMap.get(sender);

            if (!senderId) {
                throw new Error(`Sender not found: ${sender}`);
            }

            await prisma.message.create({
                data: {
                    content,
                    senderId,
                    chatId: chat.id,
                },
            });
        }
    }

    // Summary
    const totalMessages = conversations.reduce(
        (total, conversation) => total + conversation.messages.length,
        0,
    );

    console.log("Database seeded successfully!");
    console.log("------------------------------");
    console.log(`Users: ${users.length}`);
    console.log(`Conversations: ${conversations.length}`);
    console.log(`Messages: ${totalMessages}`);
    console.log("------------------------------");
    console.log("Default password: password123");
}

main()
    .catch((error: unknown) => {
        console.error("Seeding failed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
