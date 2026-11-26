import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode, CSSProperties, KeyboardEvent } from 'react'
import { Button } from './button'
import type { Category } from '../../lib/types'
export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="icon"
      style={
        {
          width: size,
          height: size,
          '--icon': `url("/Icon/${name}.svg")`,
        } as CSSProperties
      }
    />
  )
}
type DropdownOption = { value: string; label: string }
const dateKey = (date: Date) =>
  [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
const dateFromValue = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return year && month && day ? new Date(year, month - 1, day) : new Date()
}
const monthStart = (value: string) => {
  const date = dateFromValue(value)
  return new Date(date.getFullYear(), date.getMonth(), 1)
}
export function Dropdown({
  value,
  options,
  onValueChange,
  label,
}: {
  value: string
  options: DropdownOption[]
  onValueChange: (value: string) => void
  label: string
}) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLSpanElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const selected = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])

  const select = (nextValue: string) => {
    onValueChange(nextValue)
    setOpen(false)
    triggerRef.current?.focus()
  }
  const moveSelection = (direction: 1 | -1) => {
    const current = Math.max(0, options.findIndex((option) => option.value === value))
    const next = (current + direction + options.length) % options.length
    onValueChange(options[next].value)
  }
  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Escape') return setOpen(false)
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (open) moveSelection(1)
      else setOpen(true)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (open) moveSelection(-1)
      else setOpen(true)
    }
  }

  return (
    <span className="custom-dropdown" ref={dropdownRef}>
      <button
        ref={triggerRef}
        className="custom-dropdown-trigger"
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{selected.label}</span>
        <Icon name="chevron-down" size={16} />
      </button>
      {open && (
        <span className="custom-dropdown-menu" role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => select(option.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.preventDefault()
                  setOpen(false)
                  triggerRef.current?.focus()
                }
              }}
            >
              {option.label}
            </button>
          ))}
        </span>
      )}
    </span>
  )
}
export function DatePicker({
  value,
  onValueChange,
  label,
}: {
  value: string
  onValueChange: (value: string) => void
  label: string
}) {
  const [open, setOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(() => monthStart(value))
  const pickerRef = useRef<HTMLSpanElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const selectedDate = value ? dateFromValue(value) : undefined
  const firstDay = (visibleMonth.getDay() + 6) % 7
  const daysInMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    0,
  ).getDate()
  const monthTitle = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(visibleMonth)

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [])
  useEffect(() => {
    if (open) setVisibleMonth(monthStart(value))
  }, [open, value])

  const selectDate = (day: number) => {
    onValueChange(
      dateKey(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day)),
    )
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <span className="custom-datepicker" ref={pickerRef}>
      <button
        ref={triggerRef}
        className="custom-datepicker-trigger"
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false)
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setOpen(true)
          }
        }}
      >
        <span>
          {selectedDate
            ? new Intl.DateTimeFormat('pt-BR').format(selectedDate)
            : 'Selecione uma data'}
        </span>
        <Icon name="chevron-down" size={16} />
      </button>
      {open && (
        <span className="custom-datepicker-popover" role="dialog" aria-label={label}>
          <span className="datepicker-header">
            <button
              type="button"
              aria-label="Mês anterior"
              onClick={() =>
                setVisibleMonth(
                  new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1),
                )
              }
            >
              <Icon name="chevron-left" size={16} />
            </button>
            <strong>{monthTitle}</strong>
            <button
              type="button"
              aria-label="Próximo mês"
              onClick={() =>
                setVisibleMonth(
                  new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1),
                )
              }
            >
              <Icon name="chevron-right" size={16} />
            </button>
          </span>
          <span className="datepicker-weekdays" aria-hidden="true">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </span>
          <span className="datepicker-days" role="grid">
            {Array.from({ length: firstDay + daysInMonth }, (_, index) => {
              if (index < firstDay) return <span key={'empty-' + index} />
              const day = index - firstDay + 1
              const date = new Date(
                visibleMonth.getFullYear(),
                visibleMonth.getMonth(),
                day,
              )
              const key = dateKey(date)
              return (
                <button
                  key={key}
                  type="button"
                  role="gridcell"
                  aria-label={new Intl.DateTimeFormat('pt-BR', {
                    dateStyle: 'full',
                  }).format(date)}
                  aria-selected={key === value}
                  aria-current={key === dateKey(new Date()) ? 'date' : undefined}
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    selectDate(day)
                  }}
                >
                  {day}
                </button>
              )
            })}
          </span>
        </span>
      )}
    </span>
  )
}
export function Badge({ category }: { category: Category }) {
  return (
    <span className={'badge tone ' + category.color}>{category.title}</span>
  )
}
export function Tile({ category }: { category: Category }) {
  return (
    <span className={'tile tone ' + category.color}>
      <Icon name={category.icon} />
    </span>
  )
}
export function ErrorText({ children }: { children?: ReactNode }) {
  return children ? (
    <p role="alert" className="error">
      {children}
    </p>
  ) : null
}
export function Field({
  title,
  children,
  error,
  hint,
  interactive = false,
}: {
  title: string
  children: ReactNode
  error?: string
  hint?: string
  interactive?: boolean
}) {
  const content = (
    <>
      <span>{title}</span>
      {children}
      {error ? <ErrorText>{error}</ErrorText> : hint && <small>{hint}</small>}
    </>
  )
  if (interactive) return <div className="field">{content}</div>
  return (
    <label className="field">
      {content}
    </label>
  )
}
export function Modal({
  title,
  close,
  children,
  description,
}: {
  title: string
  close: () => void
  children: ReactNode
  description?: string
}) {
  return (
    <Dialog.Root
      open
      onOpenChange={(v) => {
        if (!v) close()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content
          className="modal"
          aria-describedby={description ? 'modal-desc' : undefined}
        >
          <div className="between">
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              {description && (
                <Dialog.Description id="modal-desc">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close asChild>
              <Button type="button" variant="outline" aria-label="Fechar">
                <Icon name="x" size={16} />
              </Button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
