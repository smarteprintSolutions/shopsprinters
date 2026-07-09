import React from "react";
import Image from "next/image";

const Commitment = ({
  title = "Our Commitment to You",
  subtitle = "We are committed to providing:",
  points = [
    "Reliable printing products",
    "Fair and competitive pricing",
    "Fast, secure, and trackable shipping",
    "Responsive customer support",
    "Clear and honest service representation",
    "Protection of customer privacy, as outlined in our published policies",
  ],
  image = "/ab-banner.jpg",
}) => {
  return (
    <>
      <section className="bg-[#e6dcdc] py-24 md:py-40 overflow-hidden">
        <div className="max-w-[1300px] mx-auto px-4">

          <div className="relative flex flex-col md:flex-row items-center">

            {/* 🔥 IMAGE WITH PREMIUM BORDER */}
            <div className="w-full md:w-[88%]">
              <div
                className="
                  rounded-[22px] 
                  overflow-hidden 
                  border-[1px] border-black
                  shadow-[0_30px_80px_rgba(0,0,0,0.18)]
                  p-[6px] bg-white/40 backdrop-blur-sm
                "
              >
                <div className="rounded-[18px] overflow-hidden">
                  <Image
                    src={image}
                    alt="commitment"
                    width={1200}
                    height={600}
                    className="w-full h-[360px] md:h-[520px] object-cover"
                  />
                </div>
              </div>
            </div>

            {/* 🔥 CARD */}
            <div
              className="
                w-full 
                md:w-[360px] 
                mt-[-90px] 
                md:mt-0 
                md:absolute 
                md:right-0 
                md:translate-x-[18%]
              "
            >
              <div className="
                bg-[#f2f2f2] 
                rounded-[18px] 
                border border-gray-200 
                shadow-[0_20px_60px_rgba(0,0,0,0.12)]
                p-8 md:p-10
              ">

                <h2 className="text-[22px] md:text-[28px] font-semibold mb-3">
                  {title}
                </h2>

                <p className="text-[13px] text-gray-600 mb-5">
                  {subtitle}
                </p>

                <ul className="space-y-3">
                  {points.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-[6px] w-[5px] h-[5px] bg-black rounded-full"></span>
                      <span className="text-[13px] text-gray-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Commitment;