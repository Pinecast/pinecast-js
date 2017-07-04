import React from 'react';

export default ({width = 23, height = 23, ...props}) =>
    <svg width={width} height={height} viewBox="0 0 23 23" {...props}>
        <g fill="none" fillRule="evenodd">
            <path fill="#FFF" d="M.5 22.5h22L11.47.5" />
            <path fill="#D591F8" d="M11.5 19.5L10 18l1.5-1.5L13 18m-1-3.5h-1l-1-6h3M4 20L.5 22.5h22L19 20" />
            <path stroke="#8D52D1" strokeLinecap="round" strokeLinejoin="round" d="M11.5 19.5L10 18l1.5-1.5L13 18zm.5-5h-1l-1-6h3z" />
            <path stroke="#8D52D1" strokeLinecap="round" strokeLinejoin="round" d="M.5 22.5h22L11.47.5z" />
        </g>
    </svg>;
