"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface ChatLoaderProps {
  message?: string;
}

export default function ChatLoader({
  message = "Preparing your conversations",
}: ChatLoaderProps) {
  return (
    <div className="min-h-screen w-full bg-[#090909] flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-14 h-14 rounded-2xl bg-[#1c1c1c] border border-white/10 flex items-center justify-center"
        >
          <MessageCircle
            size={25}
            strokeWidth={1.5}
            className="text-white"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-center space-y-2"
        >
          <h2 className="text-white text-xl font-medium tracking-tight">
            Almost there
          </h2>

          <p className="text-sm text-neutral-500">
            {message}
          </p>
        </motion.div>

        <div className="flex items-center gap-1.5 mt-1">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="w-1.5 h-1.5 rounded-full bg-neutral-400"
              animate={{
                opacity: [0.3, 1, 0.3],
                y: [0, -4, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: dot * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
