export default function Error({ error }: { error: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-2xl">{error}</h1>
    </div>
  );
}
