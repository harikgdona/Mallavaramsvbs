import Image from "next/image";
import { withBasePath } from "@/lib/basePath";

export function Footer() {
  return (
    <footer className="bg-maroon text-sandal mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 md:h-12 md:w-12">
            <Image
              src={withBasePath("/images/logo.png")}
              alt="Trust logo"
              fill
              sizes="48px"
              className="object-contain"
            />
          </div>
          <div>
            <p className="font-heading text-sm md:text-base">
              Sri Mallavaram Venkateswara Annadaana Samajamu
            </p>
            <p className="text-xs md:text-sm opacity-80">
              Mallavaram, Prakasam District, Andhra Pradesh
            </p>
          </div>
        </div>
        <div className="text-xs md:text-sm opacity-80">
          <p>© {new Date().getFullYear()} Mallavaram Brahmana Satram.</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

