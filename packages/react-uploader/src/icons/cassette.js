import * as React from 'react';

export default ({width = 23, height = 17, ...props}) => (
  <svg width={width} height={height} viewBox="0 0 23 17" {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FFF" d="M.5 16.5h22V.5H.5" />
      <path fill="#D591F8" d="M3 6.5l1.5 3h14l1.5-3M.5 14v2.5h6L8.167 14m6.667 0l1.666 2.5h6V14" />
      <path
        d="M8.5 3.5h6m-14 13h22V.5H.5z"
        stroke="#8d52d1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        stroke="#8d52d1"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.5 3.5l1.5 3-1.5 3h-4L3 6.5l1.5-3zm0 6h6"
      />
      <path fill="#FFF" d="M6.5 16.5l2-3h6l2 3" />
      <path
        stroke="#8d52d1"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.5 16.5l2-3h6l2 3zm12-13l1.5 3-1.5 3h-4l-1.5-3 1.5-3zm-11 2l-2 2m0-2l2 2m10-2l-2 2m0-2l2 2m-8 9v-1m2 1v-1m2 1v-1"
      />
    </g>
  </svg>
);
