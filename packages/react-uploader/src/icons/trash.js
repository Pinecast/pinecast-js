import React from 'react';

export default ({width = 22, height = 23, ...props}) =>
    <svg width={width} height={height} viewBox="0 0 22 23" {...props}>
        <g fill="none" fillRule="evenodd">
            <path fill="#FFF" d="M19.5 2.5h-17L1 5.5h2.5v17h15v-17H21" />
            <path fill="#D591F8" d="M3.5 9h15V5.5h-15" />
            <path stroke="#8D52D1" strokeLinecap="round" strokeLinejoin="round" d="M21 5.5H1l1.5-3h17zm-17.5 17h15v-17h-15zm10-22h-5l-1 2h7zm-4 8v11m3-11v11m-6-11v11m9-11v11" />
        </g>
    </svg>;
