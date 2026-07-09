'use client';

import React from 'react';

type JivoChatButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  className?: string;
};

export default function JivoChatButton({
  className,
  children,
  onClick,
  ...buttonProps
}: JivoChatButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }

    if (event.defaultPrevented) {
      return;
    }

    if (typeof window !== 'undefined' && (window as any).jivo_api?.open) {
      (window as any).jivo_api.open();
    } else {
      alert('Live chat is not available yet. Please try again in a moment.');
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
