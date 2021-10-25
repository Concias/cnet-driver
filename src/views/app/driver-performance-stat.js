/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import { Card, CardBody, CardTitle, Row, Modal, ModalBody, ModalHeader, Col, Label, FormGroup, Input, ModalFooter, Button, Form } from 'reactstrap'; //
import DatatablePagination from '../../components/DatatablePagination';
import Select from 'react-select';
import products from '../../data/products';
import { Colxx } from '../../components/common/CustomBootstrap';
import axios from 'axios';
import moment from "moment";
import { serverUrl } from '../../constants/defaultValues';
import { getCurrentUser } from '../../helpers/Utils';

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
    const [startDateRange, setStartDateRange] = useState(moment().format('YYYY-MM-DD'));
    const [endDateRange, setEndDateRange] = useState(moment().format('YYYY-MM-DD'));
    const [deviceList, setDeviceList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    let currentUser = getCurrentUser();
    React.useEffect(() => {
        fetchDrivers();
     }, []);
    const fetchDrivers = () => {
        setIsLoading(true);
        axios.get(
          `${serverUrl}/devices?user_hash=${currentUser ? currentUser.user_api_hash : ''}`
        )
          .then((res) => {
            return res.data;
          })
          .then((data) => {
            setIsLoading(false);
            // const items = data.map((x) => x.items);
            // var merged = [].concat.apply([], items);
            setDeviceList(data.map((row) => (
              {
                ...row, label: (row.driverName || '') + " ["+row.name+"]", value: row.id
              }
            )));
          });
      }
     
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
                <Card className="h-100" color="warning">
                    <CardBody>
                        <CardTitle>
                            Reports
        </CardTitle>
                        <div className="dashboard-list-with-user">
                            {/* <ul className="list-unstyled mb-0"> */}
                            <div key={"scsr"} className="d-flex flex-row mb-3 pb-3 border-bottom">
                                <h6 style={{ cursor: "pointer" }} onClick={toggleModal}><i className={"simple-icon-arrow-right-circle"} /> {"   "} Score Card Summary Report</h6>
                            </div>
                            <div key={"scsr"} className="d-flex flex-row mb-3 pb-3 border-bottom">
                                <h6 style={{ cursor: "pointer" }} onClick={toggleModal}><i className={"simple-icon-arrow-right-circle"} /> {"   "}Individual Driver Summary Report</h6>
                            </div>
                            <li key={"scsr"} className="d-flex flex-row mb-3 pb-3 border-bottom">
                                <h6 style={{ cursor: "pointer" }} onClick={toggleModal}><i className={"simple-icon-arrow-right-circle"} />{"   "}Co2 Summary Report</h6>
                            </li>
                            <li key={"scsr"} className="d-flex flex-row mb-3 pb-3 border-bottom">
                                <h6 style={{ cursor: "pointer" }} onClick={toggleModal}><i className={"simple-icon-arrow-right-circle"} />{"   "} Fuel Consumption Report</h6>
                            </li>
                            {/* </ul> */}
                        </div>
                    </CardBody>
                </Card>
            </Colxx>

            <Modal isOpen={showModal} toggle={toggleModal} size="lg">
                <ModalHeader>
                    Download Report
              </ModalHeader>
                <ModalBody>
                    <Row>
                    <Col md={6}>
                            <FormGroup>
                                <Label>
                                    From*
              </Label>
              <Input
                  type="date"
                  name="keyword"
                  id="search"
                  placeholder=" From"
                  className="mr-1"
                  value={startDateRange}
                onChange={(e) => setStartDateRange(e.target.value)}
                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label>
                                    To*
              </Label>
              <Input
                  type="date"
                  name="keyword"
                  id="search"
                  placeholder=" To"
                  className="mr-1"
                  value={endDateRange}
                onChange={(e) => setEndDateRange(e.target.value)}
                />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label>
                                    Format*
              </Label>
                                <Select
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    name="customer"

                                    options={[{ label: "PDF", value: "pdf" }, { label: "Excel", value: "excel" }]}
                                    required
                                />
                            </FormGroup>
                        </Col>
                        
                        <Col md={6}>
                            <FormGroup>
                                <Label>
                                   Select Device*
              </Label>
              <Select
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    name="customer"
                                    
                                    options={deviceList}
                                    required
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                      </ModalBody>
                <ModalFooter>
                    <Button>Generate</Button>
                </ModalFooter>
            </Modal>
        </Row>
    );
};

export default DriverPerformanceStats;
