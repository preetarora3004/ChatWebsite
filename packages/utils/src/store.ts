"use client"

import { createWithEqualityFn } from "zustand/traditional";

type User = {
  username: string,
  id: string,
}

type Chat = {
  id: string,
  name?: string | null;
}

type Participant = {
  id: string;
  chatId: string;
  username: string;
}

type existingChat = {
  id: string,
  chatId: string,
  userId: string,
  senderId: string,
}

export type MessageType = {
  id : string,
  chatId : string,
  senderId : string,
  content : string,
  createdAt : Date
}

type LastSeen = {
  id : string,
  time : Date,
  userId : string
}

type StoreType = {
  users: User[];
  loadUsers: () => Promise<void>;

  chat: Chat
  chatCreation: () => Promise<Chat>;

  lastSeen : LastSeen;
  lastSeenFetch : (userId : string) => Promise<void | null>;

  participant: Participant;
  participantCreation: (chatId: string, username: string) => Promise<Participant>;

  existingChats: existingChat[];
  searchUser: (userId: string) => Promise<existingChat[] | undefined>;

  message : MessageType[];
  addMessage : (message : MessageType) => void
  fetchMessage : (chatId : string) => Promise<MessageType[] | undefined>;

  setActiveUser: (userId: string, username : string) => void
  activeUser : {id : string, username? : string, lastSeen? : Date}

  setChatId : (chatId : string) => void;
  chatId : {id : string}
}

export const useUser = createWithEqualityFn<StoreType>((set) => ({
  users: [],
  loadUsers: async () => {
    const res = await fetch("https://chat-website-web-sigma.vercel.app/api/user", { method: "GET" });
    const data: { users: User[] } = await res.json();

    set((state) => {
      const existingIds = state.users.map((u) => u.id);
      const newOnes = data.users.filter((u) => !existingIds.includes(u.id));

      return { users: [...state.users, ...newOnes] };
    });
  },

  lastSeen : {id : "", time : new Date(), userId : ""},
  lastSeenFetch : async(userId) => {
    const res = await fetch(`https://chat-website-web-sigma.vercel.app/api/lastSeen/${userId}`,{
      method: "GET"
    })

    if(res.ok){
      const data = await res.json();

      set((state) => ({
        lastSeen: data,
        activeUser: { ...state.activeUser, lastSeen: data.time },
      }));
    }else{
      return null;
    }
  },

  
  chat: { id: "", name: "" },
  chatCreation: async () => {
    const res = await fetch("https://chat-website-web-sigma.vercel.app/api/chat", {
      method: "POST"
    })

    const data: { chat: Chat } = await res.json();
    set({ chat: data.chat });
    return data.chat;
  },

  chatId : {id : ""},
  setChatId : (chatId : string)=> {
    set({chatId : {id : chatId}})
  },

  participant: { id: "", chatId: "", username: "" },
  participantCreation: async (chatId, username) => {
    const res = await fetch(`https://chat-website-web-sigma.vercel.app/api/chat_participant/${chatId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })

    const data: { msg: string, addParticipant: Participant } = await res.json();

    const participant: Participant = {
      id: data.addParticipant.id,
      chatId: data.addParticipant.chatId,
      username
    }

    set({ participant });
    return participant;
  },

  activeUser : {id : "", username : ""},
  setActiveUser: (userId: string, username : string) =>
    set((state) => {
      const selected = state.users.find((u) => u.id === userId);
      if (!selected) return state;

      const filtered = state.users.filter((u) => u.id !== userId);
      return {
        activeUser: {id : userId, username : username},
        users: [selected, ...filtered],
      };
    }),


  existingChats: [],
  searchUser: async (userId: string) => {
    const res = await fetch('https://chat-website-web-sigma.vercel.app/api/findParticipant', {
      method: "GET",
      headers: {
        userId: userId,
      }
    })

    if (res.ok) {
      const data: existingChat[]  = await res.json();

      set({ existingChats : data });

      return data;
    }
  },

  message : [],
  addMessage: (msg: MessageType) => set((state) => ({ message: [msg, ...state.message] })),
  fetchMessage : async (chatId : string)=>{

    const res = await fetch(`https://chat-website-web-sigma.vercel.app/api/message/${chatId}`,{
      method : "GET"
    })

    if(res.ok){
      const data : MessageType[] = await res.json();

      set({message : data})
      return data;
    }
  }
}))