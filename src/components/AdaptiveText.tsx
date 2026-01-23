'use client';

import React, { useRef, useEffect, useState } from 'react';

interface AdaptiveTextProps {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
  text: string;
  className?: string;
  variant?: 'slash' | 'backslash';
}

export const AdaptiveText = ({ 
  as: Component = 'h1', 
  text, 
  className = "", 
  variant = 'slash' 
}: AdaptiveTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [clipPath, setClipPath] = useState<string>('');

  // Colors based on variant
  // SLASH: Gold top-left, Black bottom-right → Base=Black (on gold), Overlay=Gold (on black)
  // BACKSLASH: Black top-left, Gold bottom-right → Base=Gold (on black), Overlay=Black (on gold)
  const isSlash = variant === 'slash';
  const baseTextColor = isSlash ? '!text-[#0f0f0f]' : '!text-[#EAB308]';
  const overlayTextColor = isSlash ? '!text-[#EAB308]' : '!text-[#0f0f0f]';

  useEffect(() => {
    const calculateClipPath = () => {
      if (!containerRef.current) return;

      // Find the parent section (the one with the diagonal background)
      const section = containerRef.current.closest('section');
      if (!section) return;

      const sectionRect = section.getBoundingClientRect();
      const elementRect = containerRef.current.getBoundingClientRect();
      
      // Calculate element position RELATIVE TO SECTION (not viewport)
      // This doesn't change when scrolling
      const vw = sectionRect.width;
      const vh = sectionRect.height;

      // Element position within the section
      const left = elementRect.left - sectionRect.left;
      const right = elementRect.right - sectionRect.left;
      const top = elementRect.top - sectionRect.top;
      const bottom = elementRect.bottom - sectionRect.top;
      const width = elementRect.width;
      const height = elementRect.height;

      if (width === 0 || height === 0) return;

      // For SLASH: diagonal from (vw, 0) to (0, vh)
      // Line: x/vw + y/vh = 1  →  y = vh * (1 - x/vw)
      // For BACKSLASH: diagonal from (0, 0) to (vw, vh)
      // Line: y/vh = x/vw  →  y = vh * x/vw

      // Find intersection points with element edges
      const points: { x: number; y: number }[] = [];

      if (isSlash) {
        // Diagonal: x/vw + y/vh = 1
        // At x = left: y = vh * (1 - left/vw)
        // At x = right: y = vh * (1 - right/vw)
        // At y = top: x = vw * (1 - top/vh)
        // At y = bottom: x = vw * (1 - bottom/vh)

        const yAtLeft = vh * (1 - left / vw);
        const yAtRight = vh * (1 - right / vw);
        const xAtTop = vw * (1 - top / vh);
        const xAtBottom = vw * (1 - bottom / vh);

        // Check if diagonal intersects left edge (within element height)
        if (yAtLeft >= top && yAtLeft <= bottom) {
          points.push({ x: 0, y: ((yAtLeft - top) / height) * 100 });
        }
        // Check if diagonal intersects right edge
        if (yAtRight >= top && yAtRight <= bottom) {
          points.push({ x: 100, y: ((yAtRight - top) / height) * 100 });
        }
        // Check if diagonal intersects top edge (within element width)
        if (xAtTop >= left && xAtTop <= right) {
          points.push({ x: ((xAtTop - left) / width) * 100, y: 0 });
        }
        // Check if diagonal intersects bottom edge
        if (xAtBottom >= left && xAtBottom <= right) {
          points.push({ x: ((xAtBottom - left) / width) * 100, y: 100 });
        }

        // Build clip polygon for the BLACK region (bottom-right of diagonal)
        // This is where we show GOLD text
        if (points.length >= 2) {
          // Sort points to form a proper polygon
          const sortedPoints = points.sort((a, b) => {
            const angleA = Math.atan2(a.y - 50, a.x - 50);
            const angleB = Math.atan2(b.y - 50, b.x - 50);
            return angleA - angleB;
          });

          // Add corner points that are in the BLACK region (bottom-right)
          const corners = [
            { x: 100, y: 0 },   // top-right
            { x: 100, y: 100 }, // bottom-right
            { x: 0, y: 100 },   // bottom-left
          ];

          // Check which corners are in the black region (x/vw + y/vh > 1)
          const blackCorners = corners.filter(c => {
            const viewportX = left + (c.x / 100) * width;
            const viewportY = top + (c.y / 100) * height;
            return (viewportX / vw + viewportY / vh) > 1;
          });

          // Combine intersection points with black-region corners
          const allPoints = [...sortedPoints, ...blackCorners];
          
          // Sort all points clockwise around center
          const centerX = allPoints.reduce((sum, p) => sum + p.x, 0) / allPoints.length;
          const centerY = allPoints.reduce((sum, p) => sum + p.y, 0) / allPoints.length;
          allPoints.sort((a, b) => {
            const angleA = Math.atan2(a.y - centerY, a.x - centerX);
            const angleB = Math.atan2(b.y - centerY, b.x - centerX);
            return angleA - angleB;
          });

          const polygonPoints = allPoints.map(p => `${p.x}% ${p.y}%`).join(', ');
          setClipPath(`polygon(${polygonPoints})`);
        } else {
          // No intersection - element is entirely on one side
          const centerX = left + width / 2;
          const centerY = top + height / 2;
          const isOnBlackSide = (centerX / vw + centerY / vh) > 1;
          
          // If entirely on black side, show all gold text (full clip)
          // If entirely on gold side, show no gold text (empty clip)
          setClipPath(isOnBlackSide ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' : 'polygon(0% 0%, 0% 0%, 0% 0%)');
        }
      } else {
        // BACKSLASH: diagonal from (0, 0) to (vw, vh)
        // Line: y/vh = x/vw  →  y = vh * x/vw
        const yAtLeft = vh * (left / vw);
        const yAtRight = vh * (right / vw);
        const xAtTop = vw * (top / vh);
        const xAtBottom = vw * (bottom / vh);

        if (yAtLeft >= top && yAtLeft <= bottom) {
          points.push({ x: 0, y: ((yAtLeft - top) / height) * 100 });
        }
        if (yAtRight >= top && yAtRight <= bottom) {
          points.push({ x: 100, y: ((yAtRight - top) / height) * 100 });
        }
        if (xAtTop >= left && xAtTop <= right) {
          points.push({ x: ((xAtTop - left) / width) * 100, y: 0 });
        }
        if (xAtBottom >= left && xAtBottom <= right) {
          points.push({ x: ((xAtBottom - left) / width) * 100, y: 100 });
        }

        if (points.length >= 2) {
          const corners = [
            { x: 100, y: 0 },
            { x: 100, y: 100 },
            { x: 0, y: 100 },
          ];

          // For backslash, GOLD region is bottom-right (y/vh > x/vw)
          const goldCorners = corners.filter(c => {
            const viewportX = left + (c.x / 100) * width;
            const viewportY = top + (c.y / 100) * height;
            return (viewportY / vh) > (viewportX / vw);
          });

          const allPoints = [...points, ...goldCorners];
          const centerX = allPoints.reduce((sum, p) => sum + p.x, 0) / allPoints.length;
          const centerY = allPoints.reduce((sum, p) => sum + p.y, 0) / allPoints.length;
          allPoints.sort((a, b) => {
            const angleA = Math.atan2(a.y - centerY, a.x - centerX);
            const angleB = Math.atan2(b.y - centerY, b.x - centerX);
            return angleA - angleB;
          });

          const polygonPoints = allPoints.map(p => `${p.x}% ${p.y}%`).join(', ');
          setClipPath(`polygon(${polygonPoints})`);
        } else {
          const centerX = left + width / 2;
          const centerY = top + height / 2;
          const isOnGoldSide = (centerY / vh) > (centerX / vw);
          setClipPath(isOnGoldSide ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' : 'polygon(0% 0%, 0% 0%, 0% 0%)');
        }
      }
    };

    // Initial calculation
    calculateClipPath();
    
    // Only recalculate on resize (not scroll - position relative to section is fixed)
    window.addEventListener('resize', calculateClipPath);

    return () => {
      window.removeEventListener('resize', calculateClipPath);
    };
  }, [isSlash, variant]);

  return (
    <div ref={containerRef} className="relative inline-block w-full">
      {/* BASE LAYER - Shows on the "base" background side */}
      <Component className={`${className} ${baseTextColor} relative z-0`}>
        {text}
      </Component>
      
      {/* OVERLAY LAYER - Shows on the "overlay" background side */}
      <Component 
        className={`absolute inset-0 ${className} ${overlayTextColor} z-10`}
        style={{ clipPath: clipPath || 'none' }}
        aria-hidden="true"
      >
        {text}
      </Component>
    </div>
  );
};
