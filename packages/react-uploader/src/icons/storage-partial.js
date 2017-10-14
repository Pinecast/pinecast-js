import React from 'react';

export default ({width = 23, height = 24, ...props}) => (
  <svg width={width} height={height} viewBox="0 0 23 24" {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M21 6.5h-3l-2.5-6h-5L8 4.5H4L.5 10 4 14.5h16l2.5-3.5M19 23.5l3.5-5H4l-3.5 5" />
      <path fill="#D591F8" d="M11 18.5H4l-3.5 5h7m15-12.5h-3L18 12H6l-2-2H.5L4 14.5h16" />
      <path
        stroke="#8D52D1"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 6.5h-3l-2.5-6h-5L8 4.5H4L.5 10 4 14.5h16l2.5-3.5zm-6.5 0H18m-10.5 12l-3.5 5m7-5l-3.5 5m11.5 0l3.5-5H4l-3.5 5z"
      />
    </g>
  </svg>
);
