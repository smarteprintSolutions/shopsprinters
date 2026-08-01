import Image from "next/image";
import Link from "next/link";

const services = [
  {
    image: "/window-11.png",
    title: "Get Instant Support for Laptop & Desktop",
    description:
      "If your Windows laptop or desktop isn't working properly, connect with our support experts for quick troubleshooting and assistance.",
    button: "Install HP Smart",
    href: "/hp-smart-install",
  },
  {
    image: "/scan-print-fix.png",
    title: "How to print, scan and fax",
    description:
      "Learn how to print, scan and fax using your printer with easy step-by-step instructions for Windows and macOS.",
    button: "Fix Scan/Print",
    href: "/fix-printer-scan",
  },
  {
    image: "/printer-offline.png",
    title: "Printer offline or print job stuck in queue?",
    description:
      "Resolve printer offline errors and stuck print jobs using our guided troubleshooting and repair tools.",
    button: "Fix your Printer",
    href: "/find-printer",
  },
];

export default function WeProvide() {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4">

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900 md:text-4xl">
            We Provide Solutions for
          </h2>

          <p className="mt-3 text-sm text-gray-500 md:text-base">
            Storage | Software Download | Installation Issues | Network
            Connectivity Related Issues
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {services.map((item, index) => (
            <div
              key={index}
              className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6"
            >
              {/* Image */}
              <div className="flex h-24 items-center justify-center">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={150}
                  height={90}
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="mt-5 min-h-[60px] text-center text-2xl font-medium leading-snug text-gray-900">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-3 min-h-[96px] text-center text-[15px] leading-6 text-gray-600">
                {item.description}
              </p>

              {/* Button */}
              <div className="mt-auto pt-5 text-center">
                <Link
                  href={item.href}
                  className="inline-flex rounded bg-[#024AD8] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0138ab]"
                >
                  {item.button}
                </Link>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}