import { ConnectionLineType } from '../type'

export default function Controls({
  lineType,
  setLineType,
  isAnimate,
  setIsAnimate,
}: {
  lineType: ConnectionLineType
  setLineType: (lineType: ConnectionLineType) => void
  isAnimate: boolean
  setIsAnimate: (isAnimate: boolean) => void
}) {
  return (
    <div className="controls">
      <p>
        <b>Connection Line</b>
      </p>
      <div>
        {[
          ConnectionLineType.CURVED,
          ConnectionLineType.DIRECT,
          ConnectionLineType.RECTILINEAR,
        ].map((t) => {
          return (
            <button
              key={t}
              className={t === lineType ? 'active' : ''}
              onClick={() => {
                setLineType(t)
              }}
            >
              {t}
            </button>
          )
        })}
      </div>

      <p>
        <b>Animation</b>
      </p>
      <div>
        <input
          type="checkbox"
          checked={isAnimate}
          onChange={() => setIsAnimate(!isAnimate)}
        />
      </div>
    </div>
  )
}
