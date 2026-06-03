"use client";

export function ProductCustomizerLayout({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="px-6 md:px-12">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[55%_45%] md:gap-14 lg:gap-20">
        <section className="min-w-0 md:sticky md:top-[100px] md:self-start">
          {left}
        </section>
        <section className="min-w-0 md:max-h-[calc(100vh-100px)] md:overflow-y-auto md:overscroll-contain md:pr-2">
          {right}
        </section>
      </div>
    </div>
  );
}
