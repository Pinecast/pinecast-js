import * as React from 'react';

export default ({width = 23, height = 23, ...props}) => (
  <svg width={width} height={height} viewBox="0 0 23 23" {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M18.5 14.5V.5H.5v19h14v3h8v-8" />
      <path fill="#D591F8" d="M.5 19.5l2-2.5h10v2.5m-8-4l3-3v2m3-1l3-3v2m9 2v8h-8" />
      <path
        stroke="#8d52d1"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.5 19.5H.5V.5h18v12"
      />
      <path
        stroke="#8d52d1"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 12.5h-3v3l3-1m0 0V6l6-2.5v9"
      />
      <path
        stroke="#8d52d1"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 10.5h-3v3l3-1m4 5h1v3m-1 0h2m-1-4.5H18"
      />
      <path stroke="#8d52d1" strokeLinecap="round" strokeLinejoin="round" d="M14.5 22.5h8v-8h-8z" />
    </g>
  </svg>
);
