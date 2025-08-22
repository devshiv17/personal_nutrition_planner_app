import React, { useEffect, useRef, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { BaseComponentProps } from '../../../types';
import { cn } from '../../../utils/cn';

export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onClose: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  position?: 'center' | 'top';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;
  showCloseButton?: boolean;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      size = 'md',
      position = 'center',
      closeOnOverlayClick = true,
      closeOnEscape = true,
      preventScroll = true,
      showCloseButton = true,
      title,
      description,
      footer,
      children,
      className = '',
      overlayClassName = '',
      contentClassName = '',
      ...props
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElementRef = useRef<HTMLElement | null>(null);

    // Size classes
    const sizeClasses = {
      xs: 'max-w-xs',
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      full: 'max-w-full mx-4',
    };

    // Position classes
    const positionClasses = {
      center: 'items-center justify-center',
      top: 'items-start justify-center pt-20',
    };

    useEffect(() => {
      if (!open) return;

      // Store the currently focused element
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && closeOnEscape) {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscapeKey);

      // Prevent body scroll
      if (preventScroll) {
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
        
        // Restore body scroll
        if (preventScroll) {
          document.body.style.overflow = '';
        }
        
        // Restore focus
        previousActiveElementRef.current?.focus();
      };
    }, [open, closeOnEscape, onClose, preventScroll]);

    if (!open) return null;

    const modalContent = (
      <div
        className={cn(
          'modal-overlay',
          'fixed inset-0 z-50 flex',
          positionClasses[position],
          overlayClassName
        )}
        onClick={closeOnOverlayClick ? (e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        } : undefined}
      >
        <div
          ref={ref || modalRef}
          className={cn(
            'modal-content',
            'w-full',
            sizeClasses[size],
            'transform transition-all duration-200 ease-out',
            'animate-scale-in',
            contentClassName,
            className
          )}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="modal-header flex items-start justify-between">
              {title && (
                <div>
                  <h2 id="modal-title" className="text-lg font-semibold text-neutral-900">
                    {title}
                  </h2>
                  {description && (
                    <p id="modal-description" className="mt-1 text-sm text-neutral-600">
                      {description}
                    </p>
                  )}
                </div>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="ml-4 text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-4 flex-1 overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="modal-footer">
              {footer}
            </div>
          )}
        </div>
      </div>
    );

    // Render modal in portal
    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = 'Modal';

export default Modal;