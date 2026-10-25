// Endlessly scrolling text. Pauses on hover.
export default function Marquee({ items, className = '', reverse = false }) {
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className={`inline-flex animate-marquee hover:[animation-play-state:paused] ${reverse ? '[animation-direction:reverse]' : ''}`}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {items.map((t, i) => <span key={i} className="mx-6">{t}</span>)}
          </div>
        ))}
      </div>
    </div>
  )
}
