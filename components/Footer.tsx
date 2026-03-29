import Image from "next/image";
import { withBasePath } from "@/lib/basePath";

export function Footer() {
  return (
    <footer className="bg-maroon text-sandal mt-10">
      <div className="mx-auto flex max-w-6xl min-w-0 flex-col items-start justify-between gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:gap-8 md:py-10 lg:px-8">
        <div className="flex min-w-0 max-w-full items-center gap-3">
          <div className="relative h-10 w-10 md:h-12 md:w-12">
            <Image
              src={withBasePath("/images/logo.png")}
              alt="Trust logo"
              fill
              sizes="48px"
              className="object-contain"
            />
          </div>
          <div className="min-w-0 max-w-full">
            <p className="font-heading break-words text-sm md:text-base">
              Sri Mallavaram Venkateswara Annadaana Samajamu
            </p>
            <p className="text-xs md:text-sm opacity-80">
              Mallavaram, Prakasam District, Andhra Pradesh
            </p>
          </div>
        </div>
        <div className="min-w-0 max-w-full break-words text-xs opacity-80 md:text-sm">
          <p>© {new Date().getFullYear()} Mallavaram Brahmana Satram.</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

