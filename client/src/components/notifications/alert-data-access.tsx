"use client";

import { PublicKey } from "@solana/web3.js";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { createContext, ReactNode, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/app/api/api";

export interface Notification {
  id: string;
  userAddress: string;
  notification: string;
  level: "Important" | "Critical" | "Info";
  timestamp: string;
  read: boolean;
}

interface CreateNotificationDto {
  address: string;
  description?: string;
  email?:string,
  collateralThreshold:number
  healthThreshold: number;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  createNotification: (data: CreateNotificationDto) => void;
}

const NotificationsContext = createContext<NotificationsContextType>(
  {} as NotificationsContextType
);

// Local storage atom for caching
const notificationsAtom = atomWithStorage<Notification[]>(
  "user-notifications",
  []
);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const setStoredNotifications = useSetAtom(notificationsAtom);
  const notifications = useAtomValue(notificationsAtom);

  // // Calculate unread notifications
  // const unreadCount = notifications?.filter((n) => !n.read).length;

  // // Mark single notification as read
  // const markAsRead = async (id: string) => {
  //   try {
  //     await api.patch(`/notifications/${id}/read`);
  //     setStoredNotifications((prev) =>
  //       prev.map((n) => (n.id === id ? { ...n, read: true } : n))
  //     );
  //     queryClient.invalidateQueries({ queryKey: ["notifications"] });
  //   } catch (error) {
  //     toast.error("Failed to mark notification as read");
  //   }
  // };

  // // Mark all notifications as read
  // const markAllAsRead = async () => {
  //   try {
  //     await api.post("/notifications/read-all");
  //     setStoredNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  //     queryClient.invalidateQueries({ queryKey: ["notifications"] });
  //   } catch (error) {
  //     toast.error("Failed to mark all notifications as read");
  //   }
  // };

  // // Create new notification
  // const createNotification = async (data: CreateNotificationDto) => {
  //   try {
  //     const response = await api.post("/notifications", data);
  //     setStoredNotifications((prev) => [...prev, response.data]);
  //     queryClient.invalidateQueries({ queryKey: ["notifications"] });
  //     toast.success("Notification created successfully");
  //   } catch (error) {
  //     toast.error("Failed to create notification");
  //   }
  // };

  // const value: NotificationsContextType = {
  //   notifications,
  //   unreadCount,
  //   markAsRead,
  //   markAllAsRead,
  //   createNotification,
  // };

  return (
    // <NotificationsContext.Provider value={value}>
    <>
      {children}
      </>
    // </NotificationsContext.Provider>
  );
}

// Hooks
export function useNotifications() {
  return useContext(NotificationsContext);
}

export function useGetNotifications({
  address,
}: {
  address: PublicKey | undefined;
}) {
  const queryClient = useQueryClient();
  const setStoredNotifications = useSetAtom(notificationsAtom);

  return useQuery({
    queryKey: ["notifications", address?.toString()],
    queryFn: async () => {
      if (!address) return [];
      const response = await api.get(`/notifications?userAddress=${address}`);
      // Update local storage
      setStoredNotifications(response.data);
      return response.data;
    },
    enabled: !!address,
  });
}

export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNotificationDto) => {
      const response = await api.post("/notifications", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification created successfully");
    },
    onError: () => {
      toast.error("Failed to create notification");
    },
  });
}

// Utility functions
export function filterNotificationsByLevel(
  notifications: Notification[],
  level: string
) {
  return notifications.filter((n) => n.level === level);
}

export function sortNotificationsByDate(notifications: Notification[]) {
  return [...notifications].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}
