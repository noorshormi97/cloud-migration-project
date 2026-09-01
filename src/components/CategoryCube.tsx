import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/lib/router-compat';

interface CategoryCubeProps {
  title: string;
  description: string;
  icon: ReactNode;
  index: number;
  to: string;
}

export function CategoryCube({ title, description, icon, index, to }: CategoryCubeProps) {
  // The <a> is the grid item: it must carry the sizing classes, otherwise it
  // shrink-wraps to its content and tiles with shorter titles render smaller.
  return (
    <Link
      to={to}
      className="group block aspect-square w-full max-w-[180px] md:max-w-[200px]"
    >
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: Math.min(index, 8) * 0.07,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-[10px] border border-ink/10 bg-paper p-4 text-center transition-shadow duration-300 hover:shadow-lg"
      >
        <div className="flex h-20 w-20 items-center justify-center text-ink/90 transition-transform duration-300 group-hover:scale-105">
          {icon}
        </div>

        <div className="space-y-1">
          <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-ink">
            {title}
          </h3>
          <p className="font-sans text-[10px] font-light uppercase tracking-wider text-ink/50">
            {description}
          </p>
        </div>
      </motion.article>
    </Link>
  );
}
