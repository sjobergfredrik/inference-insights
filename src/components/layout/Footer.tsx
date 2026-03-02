export function Footer() {
  return (
    <footer className="bg-uu-light border-t border-gray-200 py-4 mt-auto">
      <div className="max-w-[1200px] mx-auto px-8">
        <p className="text-xs text-gray-500 font-serif m-0">
          &copy; Uppsala universitet {new Date().getFullYear()} | Inference Insights
        </p>
      </div>
    </footer>
  )
}
