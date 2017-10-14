import React from 'react';
import stringify from 'csv-stringify/lib/sync';

const CSVLink = ({children, data}) => (
  <a
    download={`report_${new Date().toISOString()}.csv`}
    href={`data:text/csv;base64,${new Buffer(stringify(data)).toString('base64')}`}
    style={{
      borderBottom: '1px dotted #aaa',
      color: '#aaa',
    }}
  >
    {children}
  </a>
);
export default CSVLink;
