import React from 'react';
import { BaseComponentProps } from '../../../types';

export interface GridProps extends BaseComponentProps {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'none';
  colsSm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'none';
  colsMd?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'none';
  colsLg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'none';
  colsXl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'none';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 12 | 14 | 16 | 20 | 24 | 28 | 32;
  gapX?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 12 | 14 | 16 | 20 | 24 | 28 | 32;
  gapY?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 12 | 14 | 16 | 20 | 24 | 28 | 32;
  autoFit?: boolean;
  autoFill?: boolean;
  minItemWidth?: string;
}

export interface GridItemProps extends BaseComponentProps {
  col?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'full';
  colSm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'full';
  colMd?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'full';
  colLg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'full';
  colXl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto' | 'full';
  row?: 1 | 2 | 3 | 4 | 5 | 6 | 'auto' | 'full';
  start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 'auto';
  end?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 'auto';
}

const Grid: React.FC<GridProps> = ({
  cols = 1,
  colsSm,
  colsMd,
  colsLg,
  colsXl,
  gap = 6,
  gapX,
  gapY,
  autoFit = false,
  autoFill = false,
  minItemWidth = '300px',
  children,
  className = '',
  ...props
}) => {
  const getColsClass = (cols: GridProps['cols']) => {
    if (cols === 'auto') return 'grid-cols-auto';
    if (cols === 'none') return 'grid-cols-none';
    return `grid-cols-${cols}`;
  };

  const getGapClass = (gap: number) => `gap-${gap}`;
  const getGapXClass = (gap: number) => `gap-x-${gap}`;
  const getGapYClass = (gap: number) => `gap-y-${gap}`;

  let gridClasses = ['grid'];

  // Auto-fit and auto-fill take precedence
  if (autoFit) {
    gridClasses.push('grid-auto-fit');
  } else if (autoFill) {
    gridClasses.push('grid-auto-fill');
  } else {
    // Column responsive classes
    gridClasses.push(getColsClass(cols));
    if (colsSm) gridClasses.push(`sm:${getColsClass(colsSm)}`);
    if (colsMd) gridClasses.push(`md:${getColsClass(colsMd)}`);
    if (colsLg) gridClasses.push(`lg:${getColsClass(colsLg)}`);
    if (colsXl) gridClasses.push(`xl:${getColsClass(colsXl)}`);
  }

  // Gap classes
  if (gapX !== undefined && gapY !== undefined) {
    gridClasses.push(getGapXClass(gapX), getGapYClass(gapY));
  } else if (gapX !== undefined) {
    gridClasses.push(getGapXClass(gapX));
  } else if (gapY !== undefined) {
    gridClasses.push(getGapYClass(gapY));
  } else {
    gridClasses.push(getGapClass(gap));
  }

  const style = (autoFit || autoFill) ? {
    gridTemplateColumns: `repeat(${autoFit ? 'auto-fit' : 'auto-fill'}, minmax(${minItemWidth}, 1fr))`,
  } : undefined;

  return (
    <div
      className={[...gridClasses, className].filter(Boolean).join(' ')}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

const GridItem: React.FC<GridItemProps> = ({
  col,
  colSm,
  colMd,
  colLg,
  colXl,
  row,
  start,
  end,
  children,
  className = '',
  ...props
}) => {
  const getColSpanClass = (span: GridItemProps['col']) => {
    if (span === 'auto') return 'col-auto';
    if (span === 'full') return 'col-span-full';
    return `col-span-${span}`;
  };

  const getRowSpanClass = (span: GridItemProps['row']) => {
    if (span === 'auto') return 'row-auto';
    if (span === 'full') return 'row-span-full';
    return `row-span-${span}`;
  };

  const getColStartClass = (start: GridItemProps['start']) => {
    if (start === 'auto') return 'col-start-auto';
    return `col-start-${start}`;
  };

  const getColEndClass = (end: GridItemProps['end']) => {
    if (end === 'auto') return 'col-end-auto';
    return `col-end-${end}`;
  };

  let itemClasses: string[] = [];

  // Column span classes
  if (col) itemClasses.push(getColSpanClass(col));
  if (colSm) itemClasses.push(`sm:${getColSpanClass(colSm)}`);
  if (colMd) itemClasses.push(`md:${getColSpanClass(colMd)}`);
  if (colLg) itemClasses.push(`lg:${getColSpanClass(colLg)}`);
  if (colXl) itemClasses.push(`xl:${getColSpanClass(colXl)}`);

  // Row span
  if (row) itemClasses.push(getRowSpanClass(row));

  // Column positioning
  if (start) itemClasses.push(getColStartClass(start));
  if (end) itemClasses.push(getColEndClass(end));

  return (
    <div
      className={[...itemClasses, className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
};

export { Grid, GridItem };