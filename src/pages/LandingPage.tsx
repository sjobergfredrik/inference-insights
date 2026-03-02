import { Link } from 'react-router'

export function LandingPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif font-bold text-uu-dark mb-4">
          Hur AI förstår språk
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Två interaktiva verktyg för att utforska språkmodellers inre mekanismer
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Link
          to="/vectors"
          className="group block p-8 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-uu-red/30 transition-all no-underline"
        >
          <div className="text-sm font-semibold text-uu-red mb-2 uppercase tracking-wide">
            Del 1
          </div>
          <h2 className="text-2xl font-serif font-bold text-uu-dark mb-3 group-hover:text-uu-red transition-colors">
            Ord som siffror
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            AI kartlägger ord som positioner i ett matematiskt rum. Ord med liknande
            betydelse hamnar nära varandra. Vi kan till och med räkna med ord:
            Kung − Man + Kvinna = Drottning.
          </p>
          <span className="text-uu-red text-sm font-medium group-hover:underline">
            Utforska vektorrymd &rarr;
          </span>
        </Link>

        <Link
          to="/tokens"
          className="group block p-8 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-uu-red/30 transition-all no-underline"
        >
          <div className="text-sm font-semibold text-uu-red mb-2 uppercase tracking-wide">
            Del 2
          </div>
          <h2 className="text-2xl font-serif font-bold text-uu-dark mb-3 group-hover:text-uu-red transition-colors">
            Nästa ord
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Med sin förståelse av språk förutsäger AI det mest sannolika nästa
            ordet i en sekvens. Chatta med en modell och se sannolikheten för
            varje valt ord i realtid.
          </p>
          <span className="text-uu-red text-sm font-medium group-hover:underline">
            Utforska token-sannolikheter &rarr;
          </span>
        </Link>
      </div>

      <div className="mt-16 max-w-2xl mx-auto text-center">
        <p className="text-sm text-gray-500 leading-relaxed">
          Dessa två koncept hänger ihop: vektorrepresentationer är grunden som
          språkmodeller bygger på, och token-prediktion är tillämpningen.
          Moderna LLM:er kombinerar båda idéerna i sin arkitektur.
        </p>
      </div>
    </div>
  )
}
