import { SimulatorGate } from "@/components/simulator-gate";

export default async function SimulatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
      <SimulatorGate id={id} />
    </main>
  );
}
