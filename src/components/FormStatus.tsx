export default function FormStatus({ message, error = false }: { message: string; error?: boolean }) {
  if (!message) return null;
  return <p role="status" className={`rounded-xl px-4 py-3 text-sm ${error ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}>{message}</p>;
}
