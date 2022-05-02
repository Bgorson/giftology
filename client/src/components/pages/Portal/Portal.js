import React, { useEffect, useState } from 'react';
import { getProducts } from '../../../api/products';
import Table from '../../atoms/Table/';
const Portal = ({ onProductSelect }) => {
  const [dataBase, setDatabase] = useState(null);

  const handleRetrieveProducts = async () => {
    const products = await getProducts();
    console.log('P', products);
    const data = products.products;
    setDatabase(data);
  };
  useEffect(() => {
    handleRetrieveProducts();
  }, []);
  const tData = React.useMemo(() => dataBase, [dataBase]);
  const columns = React.useMemo(
    () => [
      {
        Header: 'Product Name',
        accessor: 'productName', // accessor is the "key" in the data
      },
      {
        Header: 'Link',
        accessor: 'link',
      },
      {
        Header: 'Tags',
        accessor: 'tags',
      },
    ],
    []
  );
  console.log(tData);
  console.log(columns);

  // const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
  //   useTable({ columns, tData });
  return (
    dataBase && (
      <Table
        onProductSelect={onProductSelect}
        data={dataBase}
        columns={columns}
      />
    )
  );
};

export default Portal;
