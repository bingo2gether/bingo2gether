import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BingoLogo } from './Onboarding';
import { GameState } from '../types';

interface PrintViewProps {
  printType: 'cartelas' | 'tabela' | null;
  bingoCards: { id: number; numbers: number[] }[];
  maxNumber: number;
  gameState: GameState;
  cartelasPerPage?: number;
}

const PrintView: React.FC<PrintViewProps> = ({ printType, bingoCards, maxNumber, gameState, cartelasPerPage = 2 }) => {
  if (!printType) return null;
  if (typeof document === 'undefined') return null;

  const headerRef = useRef<HTMLDivElement | null>(null);
  const [layout, setLayout] = useState<{ cols: number; rows: number; cellSizeMm: number; fontSizeMm: number; usableWidthMm: number; usableHeightMm: number; scale: number; totalGridWidth: number; totalGridHeight: number } | null>(null);

  useEffect(() => {
    // compute layout when printType or maxNumber changes
    const compute = () => {
      const total = maxNumber || 0;
      if (total <= 0) return null;

      // page A4 size and margins (must match @page margins in CSS)
      const pageWidthMm = 210;
      const pageHeightMm = 297;
      const pageMarginMm = 10; // matches index.css @page

      // measure header height in mm if possible
      let headerHeightPx = 0;
      if (headerRef.current) headerHeightPx = headerRef.current.getBoundingClientRect().height;

      // measure px per mm by creating a temp element
      const ruler = document.createElement('div');
      ruler.style.width = '100mm';
      ruler.style.position = 'absolute';
      ruler.style.visibility = 'hidden';
      document.body.appendChild(ruler);
      const pxPerMm = ruler.getBoundingClientRect().width / 100;
      document.body.removeChild(ruler);

      const headerHeightMm = headerHeightPx / pxPerMm;

      const usableWidthMm = pageWidthMm - pageMarginMm * 2;
        // grid gap (in mm) - reduced to pack more cells
        const gapMm = 0.25;
        // safety margin to account for browser headers/footers and rounding differences (reduced)
        const safetyMm = 3.5;
        // allow header overlap: how much the grid may rise into the header area (in mm)
        const headerOverlapMm = 10;
        // subtract header area from usable height but allow overlap so the grid can start higher
        const effectiveHeaderMm = Math.max(0, headerHeightMm - headerOverlapMm);
        const usableHeightMm = Math.max(10, pageHeightMm - pageMarginMm * 2 - effectiveHeaderMm - 4);

      // aspect ratio
      const R = usableWidthMm / usableHeightMm;

      // compute initial columns and then iterate increasing cols until the grid fits the usable area
      let cols = Math.max(1, Math.ceil(Math.sqrt(total * R)));
      const maxCols = Math.max(cols, 500);
      let rows = Math.max(1, Math.ceil(total / cols));
      let cellSizeMm = 0;
      let fontSizeMm = 0;

      // reduce usable area with safety margin
      const safeUsableWidth = Math.max(10, usableWidthMm - safetyMm);
      const safeUsableHeight = Math.max(10, usableHeightMm - safetyMm);

      for (let c = cols; c <= maxCols; c++) {
        const r = Math.max(1, Math.ceil(total / c));
        const availableWidthForCells = safeUsableWidth - gapMm * (c - 1);
        const availableHeightForCells = safeUsableHeight - gapMm * (r - 1);
        if (availableWidthForCells <= 0 || availableHeightForCells <= 0) continue;
        const cw = availableWidthForCells / c;
        const ch = availableHeightForCells / r;
        const cs = Math.min(cw, ch);

        // small minimal cell size to remain printable
        const minCellMm = 2.2;
        if (cs <= 0) continue;

        const totalGridWidth = c * cs + gapMm * (c - 1);
        const totalGridHeight = r * cs + gapMm * (r - 1);

        // accept only if total fits within safe usable area
        if (totalGridWidth <= safeUsableWidth + 0.01 && totalGridHeight <= safeUsableHeight + 0.01 && cs >= minCellMm) {
          cols = c;
          rows = r;
          cellSizeMm = Math.floor(cs * 10) / 10; // one decimal
          fontSizeMm = Math.max(1.8, Math.min(12, cellSizeMm * 0.48));
          break;
        }

        // If we've reached the end without finding cs >= minCellMm that fits, fallback to last candidate but scaled to fit
        if (c === maxCols) {
          cols = c;
          rows = r;
          // scale cs to fit both dimensions
          const scaleW = (safeUsableWidth - gapMm * (cols - 1)) / (cols * cs);
          const scaleH = (safeUsableHeight - gapMm * (rows - 1)) / (rows * cs);
          const scale = Math.min(scaleW, scaleH, 1);
          cellSizeMm = Math.max(0.8, Math.floor(cs * scale * 10) / 10);
          fontSizeMm = Math.max(1.2, Math.min(12, cellSizeMm * 0.45));
          break;
        }
      }

      // Final safety: ensure grid total dimensions do not exceed usable area. If they do, slightly shrink cellSizeMm.
      const totalGridWidth = cols * cellSizeMm + gapMm * (cols - 1);
      const totalGridHeight = rows * cellSizeMm + gapMm * (rows - 1);
      if (totalGridWidth > safeUsableWidth) {
        const scale = (safeUsableWidth - gapMm * (cols - 1)) / (cols * cellSizeMm);
        cellSizeMm = Math.floor(cellSizeMm * scale * 10) / 10;
      }
      if (totalGridHeight > safeUsableHeight) {
        const scale = (safeUsableHeight - gapMm * (rows - 1)) / (rows * cellSizeMm);
        cellSizeMm = Math.floor(cellSizeMm * scale * 10) / 10;
      }

      // recompute font after adjustments
      fontSizeMm = Math.max(1.2, Math.min(14, cellSizeMm * 0.48));

      const totalGridWidthFinal = cols * cellSizeMm + gapMm * (cols - 1);
      const totalGridHeightFinal = rows * cellSizeMm + gapMm * (rows - 1);

      // compute scale to ensure fit into safe usable area
      const scaleW = safeUsableWidth / totalGridWidthFinal;
      const scaleH = safeUsableHeight / totalGridHeightFinal;
      const scale = Math.min(1, scaleW, scaleH);

      return { cols, rows, cellSizeMm, fontSizeMm, usableWidthMm, usableHeightMm, scale, totalGridWidth: totalGridWidthFinal, totalGridHeight: totalGridHeightFinal };
    };

    const result = compute();
    if (result) setLayout(result);
  }, [printType, maxNumber]);

  const content = (
    <div id="print-container" className="print-only" aria-hidden={printType ? 'false' : 'true'}>
      {/* Header with logo and tagline */}
      <div ref={headerRef} style={{ textAlign: 'center', marginBottom: 0 }}>
        <div style={{ marginTop: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>Bingo2Gether</div>
          <div style={{ fontSize: 11, color: '#333' }}>Construindo o futuro juntos</div>
        </div>
      </div>

      {printType === 'tabela' && (
        <div className="tabela-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Title removed for compact printing (logo kept) */}

          {layout ? (
            <div style={{ width: `${layout.totalGridWidth}mm`, height: `${layout.totalGridHeight}mm`, overflow: 'hidden', marginTop: `-${6}mm` }}>
              <div
                className="tabela-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${layout.cols}, ${layout.cellSizeMm}mm)`,
                  gridAutoRows: `${layout.cellSizeMm}mm`,
                  gap: '0.3mm',
                  width: `${layout.totalGridWidth}mm`,
                  height: `${layout.totalGridHeight}mm`,
                  alignContent: 'start',
                  justifyContent: 'start',
                  boxSizing: 'border-box',
                  fontSize: `${layout.fontSizeMm}mm`,
                  lineHeight: 1,
                  transform: `scale(${layout.scale})`,
                  transformOrigin: 'top left'
                }}
              >
                {Array.from({ length: maxNumber }, (_, i) => i + 1).map(n => (
                  <div key={n} className="tabela-number" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {n}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="tabela-grid">
              {Array.from({ length: maxNumber }, (_, i) => i + 1).map(n => (
                <div key={n} className="tabela-number">
                  {n}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {printType === 'cartelas' && (
        <div className="cartelas-container" style={{ display: 'grid', gridTemplateColumns: `repeat(${cartelasPerPage}, 1fr)`, gap: '10mm', padding: '12mm' }}>
          {bingoCards.map((card, idx) => {
            const isLastOnPage = ((idx + 1) % cartelasPerPage) === 0;
            return (
              <div
                key={card.id}
                className="cartela-print-item"
                style={{
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid',
                  pageBreakAfter: isLastOnPage ? 'always' : 'auto'
                }}
              >
                <div className="cartela-header">Cartela #{card.id}</div>
                <div className="cartela-grid">
                  {card.numbers.map(num => (
                    <div key={num} className="cartela-number">
                      <span>{num}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return createPortal(content, document.body);
};

export default PrintView;
