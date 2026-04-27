import { PageHeader } from "@/components/page-header";

export function TextToSpeechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <PageHeader title="Text to speech" />
      {children}
    </div>
  );
}
