import Link from "next/link";
import { ArrowRight, Code2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50">
      {/* background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-orange-200/40 blur-[120px]" />
        <div className="absolute bottom-[-12%] right-[-8%] h-96 w-96 rounded-full bg-blue-200/30 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <main className="relative z-10 mx-auto flex max-w-5xl flex-col gap-16 px-6 pb-24 pt-20 md:px-10 md:pt-24">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-gray-200">
            <Sparkles size={16} className="text-orange-500" />
            入口地址 1.13.152.152
          </span>
          <span className="hidden md:inline text-gray-400">保持服务运行 · 快速进入主站</span>
        </div>

        <section className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full bg-gray-900 text-white px-4 py-2 text-sm font-semibold shadow-lg">
              <Code2 size={18} />
              ReCode 主入口
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
                让刷题节奏和记忆曲线保持同步
              </h1>
              <p className="text-lg text-gray-600 md:text-xl">
                这里是你的固定入口。页面风格与主站一致，随时一键跳转到仪表盘，继续管理题目、复习和统计进度。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="px-6">
                <Link href="/home" aria-label="进入主页面">
                  <span className="mr-2">进入主页面</span>
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <div className="text-sm text-gray-500">
                保持这个服务运行，即可通过 1.13.152.152 快速访问。
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-white/80 p-8 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.12)] ring-1 ring-gray-100">
            <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full bg-orange-100 blur-3xl" />
            <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-blue-100 blur-2xl" />
            <div className="relative grid gap-4">
              <div className="flex items-center justify-between rounded-2xl bg-gray-900 px-5 py-4 text-white shadow-lg">
                <div>
                  <p className="text-sm text-gray-300">当前入口</p>
                  <p className="text-lg font-semibold">1.13.152.152</p>
                </div>
                <ArrowRight size={20} className="text-orange-300" />
              </div>

              <div className="grid gap-3 rounded-2xl border border-gray-100 bg-white/90 p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">一致的 UI 体验</p>
                    <p className="text-sm text-gray-600">延续主站的灰白 + 橙色视觉，过渡自然。</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">一键直达</p>
                    <p className="text-sm text-gray-600">点击按钮跳转 `/home`，即刻进入仪表盘。</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">保持在线</p>
                    <p className="text-sm text-gray-600">服务常驻后，可通过主地址随时访问。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}