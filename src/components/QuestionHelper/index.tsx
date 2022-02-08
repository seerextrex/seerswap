import { ReactNode, useCallback, useState } from 'react'
import Tooltip from '../Tooltip'
import { QuestionMark, QuestionWrapper } from './styled'

export default function QuestionHelper({ text }: { text: ReactNode; size?: number }) {
    const [show, setShow] = useState<boolean>(false)

    const open = useCallback(() => setShow(true), [setShow])
    const close = useCallback(() => setShow(false), [setShow])

    return (
        <span style={{ marginLeft: 4, display: 'flex', alignItems: 'center' }}>
      <Tooltip text={text} show={show}>
        <QuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
          <QuestionMark>?</QuestionMark>
        </QuestionWrapper>
      </Tooltip>
    </span>
    )
}
