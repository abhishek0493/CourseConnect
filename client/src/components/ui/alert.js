import * as React from 'react';
import { cva } from 'class-variance-authority';
import { Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const alertVariants = cva(
  'relative flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-sm',
  {
    variants: {
      variant: {
        info: 'border-primary/20 bg-primary/8 text-foreground [&>svg]:text-primary',
        success: 'border-success/25 bg-success/10 text-foreground [&>svg]:text-success',
        warning: 'border-warning/30 bg-warning/12 text-foreground [&>svg]:text-warning',
        error: 'border-destructive/25 bg-destructive/10 text-foreground [&>svg]:text-destructive',
      },
    },
    defaultVariants: { variant: 'info' },
  }
);

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const Alert = React.forwardRef(
  ({ className, variant = 'info', icon, children, ...props }, ref) => {
    const Icon = icons[variant] || Info;
    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
        {icon !== false && <Icon className="mt-0.5 h-5 w-5 shrink-0" />}
        <div className="flex-1 leading-relaxed">{children}</div>
      </div>
    );
  }
);
Alert.displayName = 'Alert';

export { Alert, alertVariants };
