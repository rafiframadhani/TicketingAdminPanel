// src/components/ui/dialog.jsx

import React from 'react';

// Dialog Context untuk berbagi state open/close
const DialogContext = React.createContext();

// 1. Dialog (Parent Component)
// Mengelola state 'open' dan menyediakan context
const Dialog = ({ open, onOpenChange, children }) => {
  const handleEscape = React.useCallback((event) => {
    if (event.key === 'Escape') {
      onOpenChange(false);
    }
  }, [onOpenChange]);

  React.useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEscape);
      // Opsional: mencegah scroll body saat modal terbuka
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // Mengembalikan scroll body
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, handleEscape]);

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

// 2. DialogTrigger
// Tombol yang memicu pembukaan dialog
const DialogTrigger = ({ asChild, children }) => {
  const { onOpenChange } = React.useContext(DialogContext);

  if (asChild) {
    // Kloning children dan tambahkan props onClick
    return React.cloneElement(children, {
      onClick: () => onOpenChange(true),
    });
  }

  return (
    <button type="button" onClick={() => onOpenChange(true)}>
      {children}
    </button>
  );
};

// 3. DialogContent
// Konten utama dialog yang muncul sebagai modal
const DialogContent = ({ children, className = '', ...props }) => {
  const { open, onOpenChange } = React.useContext(DialogContext);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" // Overlay
      onClick={() => onOpenChange(false)} // Klik overlay untuk menutup
    >
      <div
        className={`relative z-50 bg-white rounded-lg shadow-xl p-6 ${className}`}
        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutupnya
        {...props}
      >
        {children}
        {/* Tombol Tutup (opsional, bisa diintegrasikan di DialogHeader) */}
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

// 4. DialogHeader
// Header untuk dialog, biasanya berisi title
const DialogHeader = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left mb-4 ${className}`}>
      {children}
    </div>
  );
};

// 5. DialogTitle
// Judul dialog
const DialogTitle = ({ children, className = '' }) => {
  return (
    <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h3>
  );
};

// Eksport semua komponen
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle };