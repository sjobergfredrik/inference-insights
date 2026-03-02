import { Navigation } from './Navigation.tsx'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm h-[72px] shrink-0">
      <div className="max-w-[1200px] mx-auto px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/uu-logo-red.svg"
            alt="Uppsala universitet"
            className="h-12 w-auto"
          />
          <div>
            <h1 className="text-lg font-semibold text-uu-dark m-0">
              Inference Insights
            </h1>
            <p className="text-xs text-gray-500 m-0">
              Utforska hur AI-modeller arbetar med språk
            </p>
          </div>
        </div>
        <Navigation />
      </div>
    </header>
  )
}
