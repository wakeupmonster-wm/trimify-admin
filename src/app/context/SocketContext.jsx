import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children, token }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) return;

    // Connect to Backend
    const socketUrl =
      import.meta.env.VITE_API_BASE_URL ||
      "https://api.matchatfirstswipe.com.au";

    console.log("📡 Attempting Socket connection to:", socketUrl);

    const newSocket = io(socketUrl, {
      query: { token },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected successfully! ID:", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected. Reason:", reason);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
