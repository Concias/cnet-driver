import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Row, Modal, ModalBody, ModalHeader, Col, Label, FormGroup, Input, ModalFooter, Button, Form } from 'reactstrap'; //
import Select from 'react-select';
import { Colxx } from '../../../components/common/CustomBootstrap';
import axios from 'axios';
import moment from "moment";
import { serverUrl } from '../../../constants/defaultValues';
import { getCurrentUser } from '../../../helpers/Utils';
import {toast, ToastContainer} from "react-toastify";


const DeviceMTDReport = (props) => {
    const [startDateRange, setStartDateRange] = useState(moment().startOf('week').format('YYYY-MM-DD'));
    const [endDateRange, setEndDateRange] = useState(moment().format('YYYY-MM-DD'));
    const [reportType, setReportType] = useState();
    const [device, setDevice] = useState();
    const [deviceList, setDeviceList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setDownloading] = useState(false);

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
            setDeviceList(data.map((row) => (
              {
                ...row, label: (row.driverName || '') + " ["+row.name+"]", value: row.id
              }
            )));
          });
      }

      const generateReport = () => {
          
          if(!reportType){
            toast.error('Enter report type');
            return;
          }
        
          const parameters = {
              endDate: endDateRange,
              deviceIds: device
          };
          const data = {
              reportName: "device_month_till_date_report",
              reportFormat: reportType,
              parameters: parameters
          };

          let reportFormat = 'application/'+(data.reportFormat).toLowerCase();
    if(reportFormat === 'application/excel'){
        reportFormat = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }
    if(reportFormat === 'application/csv'){
        reportFormat = 'text/csv';
    }
    console.log(reportFormat);
    setDownloading(true);
    axios
        .post(`${serverUrl}/api/generate-report`, data, {responseType: 'arraybuffer'})
        .then(response => {
            setDownloading(false);
        //Create a Blob from the PDF Stream
            const file = new Blob(
                [response.data],
                {type: reportFormat});
            //Build a URL from the file
            const fileURL = URL.createObjectURL(file);
        //Open the URL on new Window
            window.open(fileURL);
        })
        .catch(error => {
            setDownloading(false);
        });
      }

    return (
        <Modal isOpen={props.showModal} toggle={props.toggleModal} size="lg">
        <ModalHeader toggle={props.toggleModal}>
            Download Device Month Till Date Report
      </ModalHeader>

        <ModalBody>
            <ToastContainer />
            <Row>
                <Col md={6}>
                    <FormGroup>
                        <Label>
                            Date*
      </Label>
      <Input
          type="date"
          name="keyword"
          id="search"
          placeholder=" Date"
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
                            onChange={x => setReportType(x.value)}
                            options={[{ label: "PDF", value: "pdf" }, { label: "Excel", value: "excel" }]}
                            required
                        />
                    </FormGroup>
                </Col>
                
                <Col md={6}>
                    <FormGroup>
                        <Label>
                           Select Device
      </Label>
      <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            name="device"
                            isMulti
                            onChange={x => setDevice(x.map(i=>i.id).toString())}
                            options={deviceList}
                            required
                        />
                    </FormGroup>
                </Col>
            </Row>
              </ModalBody>
        <ModalFooter>
            <Button onClick={generateReport}>{isDownloading ? "Downloading Report ..." : "Generate"}</Button>
        </ModalFooter>
    </Modal>

    )
}

export default DeviceMTDReport;