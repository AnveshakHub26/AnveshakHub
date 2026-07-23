"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface UseRealtimeOptions<T extends { [key: string]: any } = any> {
  table: string;
  schema?: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string;
  onData: (payload: RealtimePostgresChangesPayload<T>) => void;
}

/**
  React Hook for subscribing to live Supabase Realtime database changes.
 */
export function useSupabaseRealtime<T extends { [key: string]: any } = any>({
  table,
  schema = "public",
  event = "*",
  filter,
  onData,
}: UseRealtimeOptions<T>) {
  useEffect(() => {
    const supabase = createClient();
    const channelName = `realtime_${table}_${Date.now()}`;

    const channel: RealtimeChannel = supabase
      .channel(channelName)
      .on(
        "postgres_changes" as any,
        {
          event,
          schema,
          table,
          filter,
        },
        (payload: RealtimePostgresChangesPayload<T>) => {
          onData(payload);
        }
      )
      .subscribe((status: string) => {
        if (status === "SUBSCRIBED") {
          console.log(`[Supabase Realtime] Subscribed to ${table} changes`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, schema, event, filter, onData]);
}
