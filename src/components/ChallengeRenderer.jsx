import MultipleChoice from '../challenges/MultipleChoice'
import CompleteCode from '../challenges/CompleteCode'
import DebugCode from '../challenges/DebugCode'
import ArrangeCode from '../challenges/ArrangeCode'

export default function ChallengeRenderer(props) {
  const { challenge } = props

  switch (challenge.type) {
    case 'mcq':
      return <MultipleChoice {...props} />
    case 'complete':
      return <CompleteCode {...props} />
    case 'debug':
      return <DebugCode {...props} />
    case 'arrange':
      return <ArrangeCode {...props} />
    default:
      return (
        <p className="rounded-xl border border-crimson-500/30 bg-crimson-500/10 p-3 text-sm text-crimson-300">
          Unknown challenge type: {challenge.type}
        </p>
      )
  }
}
