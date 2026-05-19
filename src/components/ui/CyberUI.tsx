import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes efficiently
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function GlassCard({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn("glass p-6 rounded-2xl relative overflow-hidden group", className)}
    >
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export function NeonButton({ 
  children, 
  variant = 'blue', 
  className,
  id,
  onClick,
  disabled
}: { 
  children: React.ReactNode; 
  variant?: 'blue' | 'purple' | 'cyan'; 
  className?: string;
  id?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const variants = {
    blue: "border-blue-500/50 hover:bg-blue-500/10 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    purple: "border-purple-500/50 hover:bg-purple-500/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]",
    cyan: "border-cyan-400/50 hover:bg-cyan-400/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]"
  };

  return (
    <motion.button
      id={id}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={cn(
        "px-6 py-2 border rounded-full transition-all duration-300 font-medium tracking-wide",
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed grayscale",
        className
      )}
    >
      {children}
    </motion.button>
  );
}
