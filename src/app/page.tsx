'use client';

import { UploadForm } from '@/components/app/upload-form';
import { Logo } from '@/components/app/logo';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex w-full max-w-4xl flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo />
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Meet Nomiko
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Your AI-powered legal assistant. Upload a document to get started with clause-by-clause summaries, a generated glossary, and instant answers to your questions.
          </p>
        </div>
        <div className="w-full self-stretch">
            <UploadForm />
        </div>
      </div>
    </main>
  );
}
