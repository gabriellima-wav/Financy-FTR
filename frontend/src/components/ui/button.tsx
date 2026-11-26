import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
const styles = cva(
  'btn inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'primary',
        outline: 'outline-btn',
        ghost: 'ghost',
        danger: 'danger',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)
interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof styles> {
  asChild?: boolean
}
export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ asChild, variant, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'button'
    return (
      <Component
        ref={ref}
        className={twMerge(clsx(styles({ variant }), className))}
        {...props}
      />
    )
  },
)
