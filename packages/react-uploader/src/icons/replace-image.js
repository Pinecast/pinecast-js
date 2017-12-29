import * as React from 'react';

export default ({width = 22, height = 21, ...props}) => (
  <svg width={width} height={height} viewBox="0 0 23 21" {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M15.5 7.5v-5h-13v9h3v9h17v-13" />
      <path fill="#D591F8" d="M20.5 9.5v9h-13m-7-5h3v-2h-1v-9h13v3h2v-5H.5" />
      <path stroke="#8D52D1" strokeLinecap="round" strokeLinejoin="round" d="M5.5 20.5h17v-13h-17z" />
      <path stroke="#8D52D1" strokeLinecap="round" strokeLinejoin="round" d="M7.5 18.5h13v-9h-13z" />
      <path stroke="#8D52D1" strokeLinecap="round" strokeLinejoin="round" d="M3.5 13.5h-3V.5h17v5" />
      <path
        stroke="#8D52D1"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.5 5.5v-3h-13v9h1M15 12l3 3m-.5-3.5l1 1"
      />
    </g>
  </svg>
);
