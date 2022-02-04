import React, { memo, useCallback, useRef } from 'react'
import { Input, TextAreaInput } from './styled'

export const TextInput = ({
    className,
    value,
    onUserInput,
    placeholder,
    fontSize
}: {
    className?: string
    value: string
    onUserInput: (value: string) => void
    placeholder: string
    fontSize: string
}) => {
    const handleInput = useCallback(
        (event) => {
            onUserInput(event.target.value)
        },
        [onUserInput]
    )

    return (
        <div className={className}>
            <Input
                type='text'
                autoComplete='off'
                autoCorrect='off'
                autoCapitalize='off'
                spellCheck='false'
                placeholder={placeholder || ''}
                onChange={handleInput}
                value={value}
                fontSize={fontSize}
            />
        </div>
    )
}

export const ResizingTextArea = memo(
    ({
        className,
        value,
        onUserInput,
        placeholder,
        fontSize
    }: {
        className?: string
        value: string
        onUserInput: (value: string) => void
        placeholder: string
        fontSize: string
    }) => {
        const inputRef = useRef<HTMLTextAreaElement>(document.createElement('textarea'))

        const handleInput = useCallback(
            (event) => {
                inputRef.current.style.height = 'auto'
                inputRef.current.style.height = inputRef.current.scrollHeight + 'px'
                onUserInput(event.target.value)
            },
            [onUserInput]
        )

        return (
            <TextAreaInput
                style={{ height: 'auto', minHeight: '500px' }}
                className={className}
                autoComplete='off'
                autoCorrect='off'
                autoCapitalize='off'
                spellCheck='false'
                placeholder={placeholder || ''}
                onChange={handleInput}
                value={value}
                fontSize={fontSize}
                ref={inputRef}
            />
        )
    }
)

ResizingTextArea.displayName = 'ResizingTextArea'
