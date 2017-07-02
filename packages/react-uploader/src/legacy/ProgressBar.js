import React from 'react';

const ProgressBar = ({progress}) =>
    <div className='progress'>
        <i style={{width: `${progress}%`}} />
    </div>;

export default ProgressBar;
