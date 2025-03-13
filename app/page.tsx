import Link from "next/link"
import { Button } from "@/components/ui/button"
import Typewriter from "@/components/typewriter"

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Rest of the components remain the same */}
      <section className="w-full min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Lighter gradient background */}
        {/* Remove these gradient divs */}
        {/* Content */}
        <div className="relative container px-4 md:px-6 flex flex-col items-center justify-center text-center space-y-12">
          <div className="max-w-4xl space-y-8">
            <Typewriter
              prefix="We help you pitch at"
              words={[
                "Y Combinator (YC)",
                "Sequoia Capital",
                "Andreessen Horowitz",
                "Benchmark Capital",
                "Greylock Partners",
                "Accel",
                "Tiger Global Management",
                "Bessemer Venture Partners",
                "Founders Fund",
                "Blackbird Ventures",
              ]}
              typingSpeed={80}
              deletingSpeed={40}
              pauseTime={2000}
            />
            <p className="mx-auto max-w-[700px] text-muted-foreground text-xl md:text-2xl mt-8">
              Create compelling pitch videos that get you noticed by top venture capital firms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/try-now">
                <Button
                  size="lg"
                  className="min-w-[200px] text-lg bg-gradient-to-r from-[#FFB6A3] via-[#FFA088] to-[#FF8A6D] hover:opacity-90 transition-opacity"
                >
                  Try Now
                </Button>
              </Link>
              <Link href="/waitlist">
                <Button
                  size="lg"
                  variant="outline"
                  className="min-w-[200px] text-lg border-2 hover:bg-gradient-to-r hover:from-[#FFB6A3] hover:via-[#FFA088] hover:to-[#FF8A6D] hover:border-transparent transition-all duration-300"
                >
                  Join Waitlist
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        {/* Remove this gradient div */}
      </section>

      {/* Rest of the sections with updated styling */}
      <section className="w-full py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-[#FFB6A3] via-[#FFA088] to-[#FF8A6D] text-transparent bg-clip-text">
                Features
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover what makes PeachMe the best platform for pitch videos
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-8 py-12 lg:grid-cols-3 lg:gap-12">
            {[
              {
                title: "Professional Editing",
                description: "Our AI-powered tools help you create professional-quality pitch videos.",
                icon: (
                  <div className="rounded-full p-3 bg-gradient-to-br from-[#FFE5E5] to-[#FFD5D5]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8"
                    >
                      <path d="m15 5 4 4" />
                      <path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13" />
                      <path d="m8 6 2-2" />
                      <path d="m2 22 5.5-1.5L21.17 6.83a2.82 2.82 0 0 0-4-4L3.5 16.5Z" />
                    </svg>
                  </div>
                ),
              },
              {
                title: "Investor-Ready",
                description: "Craft your message to resonate with top venture capital firms.",
                icon: (
                  <div className="rounded-full p-3 bg-gradient-to-br from-[#FFE5E5] to-[#FFD5D5]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8"
                    >
                      <path d="M8.4 10.6a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Z" />
                      <path d="M18.9 17.1a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2Z" />
                      <path d="M10.5 8.5 16 12" />
                      <path d="m16 12-5.5 3.5" />
                      <path d="M17.5 6.5 22 12l-4.5 5.5" />
                    </svg>
                  </div>
                ),
              },
              {
                title: "Expert Feedback",
                description: "Get feedback from industry experts to refine your pitch.",
                icon: (
                  <div className="rounded-full p-3 bg-gradient-to-br from-[#FFE5E5] to-[#FFD5D5]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8"
                    >
                      <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                      <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                    </svg>
                  </div>
                ),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-4 rounded-xl border p-6 bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="text-primary">{feature.icon}</div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#FFB6A3] to-[#FF8A6D] text-transparent bg-clip-text">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

