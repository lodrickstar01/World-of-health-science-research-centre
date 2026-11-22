
"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DatabaseTest() {
  const [status, setStatus] = useState("Not tested");

  async function testConnection() {
    setStatus("Sending test message...");

    const { error } = await supabase
      .from("contact_messages")
      .insert({
        name: "Connection Test",
        email: "test@example.com",
        message: "Testing the website database connection."
      });

    setStatus(
      error
        ? "Error: " + error.message
        : "Success! Check contact_messages in Supabase."
    );
  }

  return (
    <main style={{ padding: 30 }}>
      <h1>Database Connection Test</h1>
      <button onClick={testConnection}>
        Send Test Message
      </button>
      <p>{status}</p>
    </main>
  );
}
