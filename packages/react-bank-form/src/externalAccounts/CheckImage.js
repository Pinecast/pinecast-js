import * as React from 'react';

const CheckImage = ({highlightAcctNum, highlightRoutingNum}) => (
  <svg viewBox="0 0 543 73" style={{width: '100%'}}>
    <defs>
      <rect id="a" width="543" height="73" rx="3" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <use fill="#F7F7F7" xlinkHref="#a" />
      <rect stroke="#E8E8E8" x=".5" y=".5" width="542" height="72" rx="3" />
      <g
        fill={highlightRoutingNum ? '#8d52d1' : '#000'}
        fillRule="nonzero"
        style={{transition: 'fill 0.2s'}}
      >
        <path d="M34.6 57.8a.8.8 0 0 1-.7-.5V53c0-.3.1-.6.5-.7h.2c.3 0 .6-.2.7-.5V48c0-.4-.2-.6-.5-.7h-.2a.8.8 0 0 1-.7-.5v-.9c0-.4.1-.6.5-.7H36c.3 0 .6.1.7.4v5.9c0 .3.2.5.5.6h1.6c.3 0 .6.2.7.6V57c0 .3-.1.6-.5.7h-4.4" />
        <path d="M45.7 57.8c-.3 0-.5-.2-.6-.5V53c0-.3.1-.6.4-.7h.2c.4 0 .6-.2.7-.5V48c0-.4-.1-.6-.4-.7h-.3c-.3 0-.5-.2-.6-.5v-.9c0-.4.1-.6.4-.7h1.6c.4 0 .6.1.7.4v5.9c0 .3.2.5.5.6H50c.3 0 .5.2.6.6V57c0 .3-.1.6-.4.7h-4.5" />
        <path d="M58.8 58.1c-.9 0-1.6-.4-2.2-1.1-.4-.5-.6-1-.6-1.7v-7c0-1 .4-1.7 1.1-2.2.5-.4 1-.6 1.7-.6H63c1 0 1.7.3 2.2 1 .4.6.6 1.1.6 1.8v7A2.7 2.7 0 0 1 63 58h-4.2m0-1.4H63c.6 0 1-.2 1.2-.7.2-.2.2-.5.2-.7v-7a1.4 1.4 0 0 0-1.4-1.4h-4.2c-.5 0-1 .2-1.2.7l-.2.7v7c0 .5.2 1 .7 1.2l.7.2" />
        <path d="M72.8 58.1c-.9 0-1.6-.4-2.2-1.1-.4-.5-.6-1-.6-1.7v-7c0-1 .4-1.7 1.1-2.2.5-.4 1-.6 1.7-.6H77c1 0 1.7.3 2.2 1 .4.6.6 1.1.6 1.8v7A2.7 2.7 0 0 1 77 58h-4.2m0-1.4H77c.6 0 1-.2 1.2-.7.2-.2.2-.5.2-.7v-7a1.4 1.4 0 0 0-1.4-1.4h-4.2c-.5 0-1 .2-1.2.7l-.2.7v7c0 .5.2 1 .7 1.2l.7.2" />
        <path d="M86.8 58.1c-.9 0-1.6-.4-2.2-1.1-.4-.5-.6-1-.6-1.7v-7c0-1 .4-1.7 1.1-2.2.5-.4 1-.6 1.7-.6H91c1 0 1.7.3 2.2 1 .4.6.6 1.1.6 1.8v7A2.7 2.7 0 0 1 91 58h-4.2m0-1.4H91c.6 0 1-.2 1.2-.7.2-.2.2-.5.2-.7v-7a1.4 1.4 0 0 0-1.4-1.4h-4.2c-.5 0-1 .2-1.2.7l-.2.7v7c0 .5.2 1 .7 1.2l.7.2" />
        <path d="M100.8 58.1c-.9 0-1.6-.4-2.2-1.1-.4-.5-.6-1-.6-1.7v-7c0-1 .4-1.7 1.1-2.2.5-.4 1-.6 1.7-.6h4.2c1 0 1.7.3 2.2 1 .4.6.6 1.1.6 1.8v7A2.7 2.7 0 0 1 105 58h-4.2m0-1.4h4.2c.6 0 1-.2 1.2-.7.2-.2.2-.5.2-.7v-7a1.4 1.4 0 0 0-1.4-1.4h-4.2c-.5 0-1 .2-1.2.7l-.2.7v7c0 .5.2 1 .7 1.2l.7.2" />
        <path d="M114.8 58.1c-.9 0-1.6-.4-2.2-1.1-.4-.5-.6-1-.6-1.7v-7c0-1 .4-1.7 1.1-2.2.5-.4 1-.6 1.7-.6h4.2c1 0 1.7.3 2.2 1 .4.6.6 1.1.6 1.8v7A2.7 2.7 0 0 1 119 58h-4.2m0-1.4h4.2c.6 0 1-.2 1.2-.7.2-.2.2-.5.2-.7v-7a1.4 1.4 0 0 0-1.4-1.4h-4.2c-.5 0-1 .2-1.2.7l-.2.7v7c0 .5.2 1 .7 1.2l.7.2" />
        <path d="M128.8 58.1c-.9 0-1.6-.4-2.2-1.1-.4-.5-.6-1-.6-1.7v-7c0-1 .4-1.7 1.1-2.2.5-.4 1-.6 1.7-.6h4.2c1 0 1.7.3 2.2 1 .4.6.6 1.1.6 1.8v7A2.7 2.7 0 0 1 133 58h-4.2m0-1.4h4.2c.6 0 1-.2 1.2-.7.2-.2.2-.5.2-.7v-7a1.4 1.4 0 0 0-1.4-1.4h-4.2c-.5 0-1 .2-1.2.7l-.2.7v7c0 .5.2 1 .7 1.2l.7.2" />
        <path d="M142.8 58.1c-.9 0-1.6-.4-2.2-1.1-.4-.5-.6-1-.6-1.7v-7c0-1 .4-1.7 1.1-2.2.5-.4 1-.6 1.7-.6h4.2c1 0 1.7.3 2.2 1 .4.6.6 1.1.6 1.8v7A2.7 2.7 0 0 1 147 58h-4.2m0-1.4h4.2c.6 0 1-.2 1.2-.7.2-.2.2-.5.2-.7v-7a1.4 1.4 0 0 0-1.4-1.4h-4.2c-.5 0-1 .2-1.2.7l-.2.7v7c0 .5.2 1 .7 1.2l.7.2" />
      </g>
      <g
        fill={highlightAcctNum ? '#8d52d1' : '#000'}
        fillRule="nonzero"
        style={{transition: 'fill 0.2s'}}
      >
        <path d="M197.8 58.1c-.9 0-1.6-.4-2.2-1.1-.4-.5-.6-1-.6-1.7v-7c0-1 .4-1.7 1.1-2.2.5-.4 1-.6 1.7-.6h4.2c1 0 1.7.3 2.2 1 .4.6.6 1.1.6 1.8v7A2.7 2.7 0 0 1 202 58h-4.2m0-1.4h4.2c.6 0 1-.2 1.2-.7.2-.2.2-.5.2-.7v-7a1.4 1.4 0 0 0-1.4-1.4h-4.2c-.5 0-1 .2-1.2.7l-.2.7v7c0 .5.2 1 .7 1.2l.7.2" />
        <path d="M211.8 58.1c-.9 0-1.6-.4-2.2-1.1-.4-.5-.6-1-.6-1.7v-7c0-1 .4-1.7 1.1-2.2.5-.4 1-.6 1.7-.6h4.2c1 0 1.7.3 2.2 1 .4.6.6 1.1.6 1.8v7A2.7 2.7 0 0 1 216 58h-4.2m0-1.4h4.2c.6 0 1-.2 1.2-.7.2-.2.2-.5.2-.7v-7a1.4 1.4 0 0 0-1.4-1.4h-4.2c-.5 0-1 .2-1.2.7l-.2.7v7c0 .5.2 1 .7 1.2l.7.2" />
        <path d="M225.8 58.1c-.9 0-1.6-.4-2.2-1.1-.4-.5-.6-1-.6-1.7v-7c0-1 .4-1.7 1.1-2.2.5-.4 1-.6 1.7-.6h4.2c1 0 1.7.3 2.2 1 .4.6.6 1.1.6 1.8v7A2.7 2.7 0 0 1 230 58h-4.2m0-1.4h4.2c.6 0 1-.2 1.2-.7.2-.2.2-.5.2-.7v-7a1.4 1.4 0 0 0-1.4-1.4h-4.2c-.5 0-1 .2-1.2.7l-.2.7v7c0 .5.2 1 .7 1.2l.7.2" />
        <path d="M238.7 58.1a.8.8 0 0 1-.7-.5v-4.4c0-.4.2-.6.5-.7h.2c.3 0 .6-.2.7-.5v-3.7c0-.4-.2-.6-.5-.7h-.2a.8.8 0 0 1-.7-.5v-.9c0-.4.2-.6.5-.7h1.5c.3 0 .6.1.7.4v5.9c0 .3.2.5.5.6h1.7c.3 0 .6.2.7.6v4.4c0 .3-.1.6-.5.7h-4.4" />
        <path d="M249.2 58.1c-.3 0-.5-.2-.6-.5v-5.8c0-.4 0-.6.4-.7h3c.4 0 .6-.2.7-.5v-3c0-.4-.1-.6-.4-.7h-3.1c-.3 0-.5-.2-.6-.5v-.2c0-.4 0-.6.4-.7h4.4c.4 0 .6.1.7.4v5.9c0 .3-.1.5-.4.6h-3.1c-.3 0-.5.2-.6.6v3c0 .3.1.6.4.7h3c.4 0 .6.2.7.5v.2c0 .3-.1.6-.4.7h-4.5" />
        <path d="M260.4 58.1c-.4 0-.6-.2-.7-.5v-.2c0-.3.1-.6.4-.7h3.1c.3 0 .5-.2.6-.5v-3c0-.4 0-.6-.4-.7h-3c-.4 0-.6-.2-.7-.5v-.2c0-.4.1-.6.4-.7h3.1c.3 0 .5-.2.6-.5v-3c0-.4 0-.6-.4-.7h-3c-.4 0-.6-.2-.7-.5v-.2c0-.4.1-.6.4-.7h4.5c.3 0 .5.1.6.4v5.2c0 .3.2.5.6.6h.2c.3 0 .5.2.7.5v5.2c0 .3-.2.6-.5.7h-5.8" />
        <path d="M278.1 58.1c-.3 0-.5-.2-.7-.5V56c0-.3-.1-.6-.5-.7h-4.4a.8.8 0 0 1-.7-.5v-8.6c0-.4.2-.6.5-.7h1.6c.3 0 .6.1.7.4v7.3c0 .3.2.5.5.7h1.6c.3 0 .6-.2.7-.5v-.2c0-.4.2-.6.5-.7h1.6c.4 0 .6.1.7.5v4.4c0 .3-.1.6-.4.7H278" />
        <path d="M285.4 58.1c-.3 0-.5-.2-.6-.5v-.2c0-.3 0-.6.4-.7h4.5c.3 0 .5-.2.6-.5v-3c0-.4-.1-.6-.4-.7h-4.5c-.3 0-.5-.2-.6-.5v-5.8c0-.4 0-.6.4-.7h5.9c.3 0 .5.1.6.4v.3c0 .3-.1.5-.4.6h-4.5c-.3 0-.5.2-.6.5v3.1c0 .3.1.5.4.6h4.5c.3 0 .5.2.6.5v5.9c0 .3-.1.6-.4.7h-5.9" />
        <path d="M297.6 58.1c-.4 0-.6-.2-.7-.5V46.2c0-.4.1-.6.4-.7h4.5c.3 0 .5.1.6.4v2.3c0 .4 0 .6-.4.7h-.2c-.4 0-.6 0-.7-.4v-.9c0-.4-.2-.6-.5-.7H299c-.4 0-.6.1-.7.4v4.5c0 .3.1.5.4.6h5.9c.3 0 .5.2.7.6v4.4c0 .3-.2.6-.5.7h-7.2m1.4-1.4h4.2c.3 0 .5-.2.7-.5v-1.6c0-.3-.2-.6-.5-.7H299c-.4 0-.6.1-.7.5V56c0 .3.1.6.4.7h.3" />
        <path d="M313.3 58.1c-.3 0-.5-.2-.6-.5v-5.8c0-.3 0-.5.3-.7l2-.8c.3-.1.4-.3.4-.6v-2.1c0-.4-.1-.6-.4-.7h-3.1c-.3 0-.5.1-.7.4V49c0 .3-.1.5-.5.6h-.2c-.3 0-.5 0-.7-.4v-3c0-.4.2-.6.5-.7h5.8c.4 0 .6.1.7.4v4.7c0 .3-.1.6-.4.7l-2 .8c-.2 0-.4.3-.4.6v4.7c0 .3-.1.6-.4.7h-.3" />
        <path d="M322.2 58.1c-.3 0-.5-.2-.6-.5v-5.2c0-.3 0-.5.4-.6h.2c.4 0 .6-.2.7-.5v-5.2c0-.3.2-.5.5-.6h5.9c.3 0 .5.1.6.4v5.2c0 .3.2.5.5.6h.3c.3 0 .5.2.6.5v5.2c0 .3 0 .6-.4.7h-8.7m2.8-1.4h2.9c.3 0 .5-.2.6-.5v-3c0-.4-.1-.6-.4-.7H325c-.3 0-.5.1-.6.5v3c0 .3.1.6.4.7h.2m0-5.6h2.9c.3 0 .5-.2.6-.5v-3c0-.4-.1-.6-.4-.7H325c-.3 0-.5.1-.6.4v3.1c0 .3.1.5.4.6h.2" />
        <path d="M342.8 58.1a.8.8 0 0 1-.7-.5v-4.4c0-.4-.2-.6-.5-.7h-4.4c-.4 0-.6-.2-.7-.5v-5.8c0-.4.1-.6.4-.7h7.3c.3 0 .6.1.7.4v11.5c0 .3-.2.6-.5.7h-1.6m0-7c.3 0 .5-.2.7-.5v-3c0-.4-.2-.6-.5-.7h-4.4c-.4 0-.6.1-.7.4v3.1c0 .3.1.5.4.6h4.5" />
      </g>
      <path
        d="M385.8 58.1c-.9 0-1.6-.4-2.2-1.1-.4-.5-.6-1-.6-1.7v-7c0-1 .4-1.7 1.1-2.2.5-.4 1-.6 1.7-.6h4.2c1 0 1.7.3 2.2 1 .4.6.6 1.1.6 1.8v7A2.7 2.7 0 0 1 390 58h-4.2m0-1.4h4.2c.6 0 1-.2 1.2-.7.2-.2.2-.5.2-.7v-7a1.4 1.4 0 0 0-1.4-1.4h-4.2c-.5 0-1 .2-1.2.7l-.2.7v7c0 .5.2 1 .7 1.2l.7.2"
        fill="#000"
        fillRule="nonzero"
      />
      <path
        d="M398.7 58.1a.8.8 0 0 1-.7-.5v-4.4c0-.4.2-.6.5-.7h.2c.3 0 .6-.2.7-.5v-3.7c0-.4-.2-.6-.5-.7h-.2a.8.8 0 0 1-.7-.5v-.9c0-.4.2-.6.5-.7h1.5c.3 0 .6.1.7.4v5.9c0 .3.2.5.5.6h1.7c.3 0 .6.2.7.6v4.4c0 .3-.1.6-.5.7h-4.4"
        fill="#000"
        fillRule="nonzero"
      />
      <path
        d="M409.2 58.1c-.3 0-.5-.2-.6-.5v-5.8c0-.4 0-.6.4-.7h3c.4 0 .6-.2.7-.5v-3c0-.4-.1-.6-.4-.7h-3.1c-.3 0-.5-.2-.6-.5v-.2c0-.4 0-.6.4-.7h4.4c.4 0 .6.1.7.4v5.9c0 .3-.1.5-.4.6h-3.1c-.3 0-.5.2-.6.6v3c0 .3.1.6.4.7h3c.4 0 .6.2.7.5v.2c0 .3-.1.6-.4.7h-4.5"
        fill="#000"
        fillRule="nonzero"
      />
      <path
        d="M420.4 58.1c-.4 0-.6-.2-.7-.5v-.2c0-.3.1-.6.4-.7h3.1c.3 0 .5-.2.6-.5v-3c0-.4 0-.6-.4-.7h-3c-.4 0-.6-.2-.7-.5v-.2c0-.4.1-.6.4-.7h3.1c.3 0 .5-.2.6-.5v-3c0-.4 0-.6-.4-.7h-3c-.4 0-.6-.2-.7-.5v-.2c0-.4.1-.6.4-.7h4.5c.3 0 .5.1.6.4v5.2c0 .3.2.5.6.6h.2c.3 0 .5.2.7.5v5.2c0 .3-.2.6-.5.7h-5.8"
        fill="#000"
        fillRule="nonzero"
      />
      <path
        d="M16.9 56c-.3 0-.5-.2-.6-.5v-6.4c0-.3.1-.5.4-.6H18c.3 0 .5 0 .6.4v6.4c0 .3 0 .5-.4.6H17m5 1.9c-.3 0-.5-.1-.6-.4v-2.7c0-.3 0-.5.4-.6h2.7c.3 0 .5.1.6.4v2.7c0 .3-.1.5-.4.6H22m0-7.5c-.3 0-.5-.1-.6-.4v-2.7c0-.3 0-.5.4-.6h2.7c.3 0 .5.1.6.4v2.7c0 .3-.1.5-.4.6H22"
        fill="#000"
        fillRule="nonzero"
      />
      <path
        d="M168.4 56.2c-.2 0-.4-.1-.5-.4v-6.4c0-.3 0-.5.3-.6h1.5c.3 0 .5 0 .6.4v6.4c0 .3-.1.5-.4.6h-1.5m5 1.9c-.3 0-.5-.1-.6-.4V55c0-.3.2-.5.4-.6h2.7c.3 0 .5 0 .6.4v2.7c0 .3 0 .5-.4.6h-2.7m0-7.5c-.3 0-.5-.1-.6-.4v-2.7c0-.3.2-.5.4-.6h2.7c.3 0 .5.1.6.4V50c0 .3 0 .5-.4.6h-2.7"
        fill="#000"
        fillRule="nonzero"
      />
      <path
        d="M356 56.9c-.3 0-.5-.2-.6-.5V50c0-.3 0-.5.4-.6h.2c.3 0 .5.1.6.4v6.4c0 .3-.1.5-.4.6h-.2m2.5 0c-.3 0-.5 0-.6-.4V50c0-.3 0-.5.4-.6h.2c.3 0 .5.1.6.4v6.4c0 .3-.1.5-.4.6h-.2m2.5-3.7c-.3 0-.5-.1-.6-.4v-4c0-.3 0-.5.4-.6h2.7c.3 0 .5.2.6.4v4c0 .3-.2.5-.4.6H361"
        fill="#000"
        fillRule="nonzero"
      />
      <path
        d="M19.5 22.3L17.4 17v7.5h-1v-8.7H18l2.2 5.6 2.2-5.6H24v8.7h-1V17l-2.2 5.3h-1.3zm6.7 2.2v-8.7h5.6v1h-4.5v2.5h4v1h-4v3.2h4.5v1h-5.6zM37 22.3L34.8 17v7.5h-1v-8.7h1.6l2.3 5.6 2.2-5.6h1.5v8.7h-1V17l-2.1 5.3H37zm9.9 2.3c-1 0-1.9-.3-2.4-.8-.6-.5-.9-1.3-.9-2.3v-2.7c0-1 .3-1.8.9-2.3.5-.6 1.3-.8 2.4-.8 1 0 2 .2 2.5.8.5.5.8 1.3.8 2.3v2.7c0 1-.3 1.8-.9 2.3-.5.5-1.3.8-2.4.8zm0-1c.8 0 1.3-.1 1.7-.5.3-.3.5-.9.5-1.6v-2.7c0-.7-.2-1.3-.5-1.6-.4-.4-1-.6-1.7-.6-.8 0-1.3.2-1.7.6-.3.3-.5.9-.5 1.6v2.7c0 .7.2 1.3.5 1.6.4.4 1 .5 1.7.5z"
        fill="#000"
      />
      <path d="M60.5 24.5h242" stroke="#000" strokeLinecap="square" />
      <path d="M330.5 24.5h195" stroke="#000" strokeLinecap="square" />
    </g>
  </svg>
);

export default CheckImage;
