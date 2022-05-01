import React, { useEffect, useState } from 'react';
import { debug } from 'webpack';

const Product = (props) => {
  const { product } = props;
  console.log('WHAT I CLICKED', product.row.original);

  // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
  //   useTable({ columns, tData });
  return (
    <>
      <h1> Specific Product: </h1>
      {Object.keys(product.row.original).map((key, i) => (
        <p key={i}>
          <span>Key: {key}</span>
          <span>Value: {product.row.original[key]}</span>
        </p>
      ))}
    </>
  );
};

export default Product;
