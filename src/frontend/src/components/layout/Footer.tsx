export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-sidebar border-t border-sidebar-border text-sidebar-foreground/70 py-4 mt-auto">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-sans">
        <p className="text-sidebar-foreground/50">
          © {year} Memorable Holidays. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
