/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
import React, {useState} from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import { Card, CardBody, CardTitle , Row, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap'; //
import DatatablePagination from '../../components/DatatablePagination';
import IntlMessages from '../../helpers/IntlMessages';

import products from '../../data/products';
import { Colxx } from '../../components/common/CustomBootstrap';
import { NavLink } from 'react-router-dom';

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 6 },
    },
    useSortBy,
    usePagination
  );

  return (
    <>
      <table {...getTableProps()} className="r-table table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, columnIndex) => (
                <th
                  key={`th_${columnIndex}`}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={
                    column.isSorted
                      ? column.isSortedDesc
                        ? 'sorted-desc'
                        : 'sorted-asc'
                      : ''
                  }
                >
                  {column.render('Header')}
                  <span />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={`td_${cellIndex}`}
                    {...cell.getCellProps({
                      className: cell.column.cellClass,
                    })}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <DatatablePagination
        page={pageIndex}
        pages={pageCount}
        canPrevious={canPreviousPage}
        canNext={canNextPage}
        pageSizeOptions={[4, 10, 20, 30, 40, 50]}
        showPageSizeOptions={false}
        showPageJump={false}
        defaultPageSize={pageSize}
        onPageChange={(p) => gotoPage(p)}
        onPageSizeChange={(s) => setPageSize(s)}
        paginationMaxSize={pageCount}
      />
    </>
  );
}

const DriverPerformanceStats = () => {
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(!showModal);
  const cols = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'title',
        cellClass: 'text-muted',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      },
      {
        Header: 'Areas',
        accessor: 'category',
        cellClass: 'text-muted',
        Cell: (props) => <>{props.value}</>,
        sortType: 'basic',
      }
    ],
    []
  );

  return (
      <Row>
          <Colxx md={4}>
          <Card className="h-100">
      <CardBody>
        <CardTitle>
         Top Drivers
        </CardTitle>
        <Table columns={cols} data={products} />
      </CardBody>
    </Card>
          </Colxx>
          <Colxx md={4}>
          <Card className="h-100">
      <CardBody>
        <CardTitle>
        Drivers In Training
        </CardTitle>
        <Table columns={cols} data={products} />
      </CardBody>
    </Card>
          </Colxx>
          <Colxx md={4}>
          <Card className="h-100">
      <CardBody>
        <CardTitle>
       Reports
        </CardTitle>
        <ul className="list-unstyled mb-0">
            <li key={"scsr"} className="mb-2">
            <h6 style={{cursor:"pointer"}} onClick={toggleModal}><i className={"simple-icon-rocket"} /> {"   "} Score Card Summary Report</h6>
            </li>
            <li key={"scsr"} className="mb-2">
                <h6 style={{cursor:"pointer"}} onClick={toggleModal}><i className={"simple-icon-rocket"} /> {"   "}Individual Driver Summary Report</h6>
            </li>
            <li key={"scsr"} className="mb-2">
                <h6 style={{cursor:"pointer"}} onClick={toggleModal}><i className={"simple-icon-rocket"} />{"   "}Co2 Summary Report</h6>
            </li>
            <li key={"scsr"} className="mb-2">
                <h6 style={{cursor:"pointer"}} onClick={toggleModal}><i className={"simple-icon-rocket"} />{"   "} Fuel Consumption Report</h6>
            </li>
        </ul>
      </CardBody>
    </Card>
          </Colxx>

          <Modal isOpen={showModal} toggle={toggleModal} size="lg">
              <ModalHeader>
                  Download Report
              </ModalHeader>
              <ModalBody>


              </ModalBody>

          </Modal>
    </Row>
  );
};

export default DriverPerformanceStats;
