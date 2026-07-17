'use client';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, MouseEvent, useState } from 'react';

export function TiltCard({ 
  children, 
  className = '', 
  style = {},
  initialRotateZ = 0
}: { 
  children: ReactNode, 
  className?: string, 
  style?: React.CSSProperties,
  initialRotateZ?: number
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  // Плавность возврата и движения
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["1.5deg", "-1.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-2deg", "2deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateZ: isHovered ? 0 : initialRotateZ }} 
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ ...style, rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900 }}
      className={className}
    >
      {/* ВОТ ЗДЕСЬ РЕШЕНИЕ ПРОБЛЕМЫ: мы сделали этот внутренний слой полноценным flex-контейнером */}
      <div style={{ transform: "translateZ(1px) translateY(-2px)" }} className="h-full w-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}