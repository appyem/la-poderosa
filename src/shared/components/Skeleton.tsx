import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={twMerge(clsx("animate-pulse rounded-md bg-dark-elevated", className))}
      {...props}
    />
  );
};