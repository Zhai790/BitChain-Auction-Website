import React, { JSX } from 'react';
import './button.css';

export interface ButtonProps {
    text: string;
    icon?: React.ElementType;
    ariaLabel?: string;
    onClick?: () => void;
}

export function PrimaryButton({ text, icon, ariaLabel, onClick }: ButtonProps) {
    return (
        <button
            type="button"
            aria-label={ariaLabel ?? text}
            className="primary-button"
            onClick={onClick}
        >
            {icon && (
                <span className="button-icon">{React.createElement(icon)}</span>
            )}
            <span>{text}</span>
        </button>
    );
}
