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
import ScoreSummaryReport from './report-modal/score-summary-report';
import HarshEventSummaryReport from './report-modal/harsh-event-summary-report';
import Co2SummaryReport from './report-modal/co2-summary-report';
import DeviceMTDReport from './report-modal/device-mtd-report';

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
    const [showHarshModal, setShowHarshModal] = useState(false);
    const toggleHarshModal = () => setShowHarshModal(!showHarshModal);
    const [showCo2Modal, setShowCo2Modal] = useState(false);
    const toggleCo2Modal = () => setShowCo2Modal(!showCo2Modal);
    const [showDeviceMTDModal, setShowDeviceMTDModal] = useState(false);
    const toggleDeviceMTDModal = () => setShowDeviceMTDModal(!showDeviceMTDModal);
 
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
            {/* <Colxx md={4}>
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
             */}
            <Colxx md={12}>
                <Card className="h-100" color="secondary">
                    <CardBody>
                        <CardTitle>
                            Reports
        </CardTitle>
                        <div className="dashboard-list-with-user">
                            {/* <ul className="list-unstyled mb-0"> */}
                            <div key={"scsr"} className="d-flex flex-row mb-3 pb-3 border-bottom">
                                <h6 style={{ cursor: "pointer" }} onClick={toggleModal}><i className={"simple-icon-arrow-right-circle"} /> {"   "} Score Card Summary Report</h6>
                            </div>
                            <div key={"scsr9"} className="d-flex flex-row mb-3 pb-3 border-bottom">
                                <h6 style={{ cursor: "pointer" }} onClick={toggleHarshModal}><i className={"simple-icon-arrow-right-circle"} /> {"   "} Harsh Event Summary Report</h6>
                            </div>
                            <div key={"scsr3"} className="d-flex flex-row mb-3 pb-3 border-bottom">
                                <h6 style={{ cursor: "pointer" }} onClick={toggleDeviceMTDModal}><i className={"simple-icon-arrow-right-circle"} /> {"   "} Device Month Till Date Report</h6>
                            </div>
                            <div key={"scsr3"} className="d-flex flex-row mb-3 pb-3 border-bottom">
                                <h6 style={{ cursor: "pointer" }} onClick={toggleCo2Modal}><i className={"simple-icon-arrow-right-circle"} /> {"   "} Co2 Emission Report</h6>
                            </div>
                            {/* <div key={"scsr1"} className="d-flex flex-row mb-3 pb-3 border-bottom">
                                <h6 style={{ cursor: "pointer" }} onClick={toggleModal}><i className={"simple-icon-arrow-right-circle"} /> {"   "}Individual Driver Summary Report</h6>
                            </div>
                            <li key={"scsr2"} className="d-flex flex-row mb-3 pb-3 border-bottom">
                                <h6 style={{ cursor: "pointer" }} onClick={toggleModal}><i className={"simple-icon-arrow-right-circle"} />{"   "}Co2 Summary Report</h6>
                            </li>
                            <li key={"scsr3"} className="d-flex flex-row mb-3 pb-3 border-bottom">
                                <h6 style={{ cursor: "pointer" }} onClick={toggleModal}><i className={"simple-icon-arrow-right-circle"} />{"   "} Fuel Consumption Report</h6>
                            </li> */}
                            {/* </ul> */}
                        </div>
                    </CardBody>
                </Card>
            </Colxx>

<ScoreSummaryReport showModal={showModal} toggleModal={toggleModal} />
<HarshEventSummaryReport showModal={showHarshModal} toggleModal={toggleHarshModal} />
<Co2SummaryReport showModal={showCo2Modal} toggleModal={toggleCo2Modal} />
<DeviceMTDReport showModal={showDeviceMTDModal} toggleModal={toggleDeviceMTDModal} />
             </Row>
    );
};

export default DriverPerformanceStats;
