
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestDatabasePage() {
  const [message, setMessage] = useState("Connecting...");

  useEffect(() => {
    async function testConnection() {
      const client = supabase;

      if (client === null) {
        setMessage("Supabase is not configured. Check environment variables.");
        return;
      }

      const { data, error } = await client
        .from("medical_resources")
        .select("id, title, subject")
        .limit(10);

      if (error) {
        setMessage("Database error: " + error.message);
        return;
      }

      setMessage(
        `Connected successfully. Found ${data?.length ?? 0} resources.`
      );
    }

    void testConnection();
  }, []);

  return (
    <main style={{ padding: 30 }}>
      <h1>Medical Research Centre — Database Test</h1>
      <p>{message}</p>
    </main>
  );
}
