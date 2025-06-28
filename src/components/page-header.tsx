import { Logo } from '@/components/icons';

export function PageHeader() {
  return (
    <header className="flex items-center gap-3 border-b px-4 lg:px-6 h-16 shrink-0">
      <Logo className="h-6 w-6 text-primary" />
      <h1 className="text-xl font-semibold font-headline text-foreground">
        CraftMyCV
      </h1>
    </header>
  );
}
