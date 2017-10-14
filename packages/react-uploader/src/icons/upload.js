import React from 'react';

export default ({width = 23, height = 23, ...props}) => (
  <svg width={width} height={height} viewBox="0 0 23 23" {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M19.5 8.5H4l-3.5 8v6h22v-6" />
      <path fill="#D591F8" d="M19.5 20l-1 1-1-1H.5v2.5h22V20" />
      <path
        stroke="#8D52D1"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.5 8.5h5l3 8H.5l3.5-8h4.5m-8 8v6h22v-6M8 4L11.5.5 15 4M11.5.5v11"
      />
      <path stroke="#8D52D1" strokeLinecap="round" strokeLinejoin="round" d="M18.5 18L17 19.5l1.5 1.5 1.5-1.5z" />
    </g>
  </svg>
);
