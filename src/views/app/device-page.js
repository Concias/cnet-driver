import React, { useState, useEffect } from 'react';
import { Row, Button, Card, CardBody, CardTitle, Progress, Alert } from 'reactstrap';
import IntlMessages from '../../helpers/IntlMessages';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import Breadcrumb from '../../containers/navs/Breadcrumb';
import { getCurrentUser } from '../../helpers/Utils';
import { serverUrl } from '../../constants/defaultValues';
import RadialProgressCard from '../../components/cards/RadialProgressCard';
import {  BarChart } from '../../components/charts';
import moment from "moment";
import axios from 'axios';

const DevicePage = (props) => {
  const device = props.location.state;
  const deviceName = device['name'];
  const deviceId = device['id'];
  const driverName = device['driver_name'];
  const [startDateRange, setStartDateRange] = useState(moment().format('YYYY-MM-DD'));
  const [endDateRange, setEndDateRange] = useState(moment().format('YYYY-MM-DD'));
  const [deviceData, setDeviceData] = useState({ totalActive: 0, distance: 0, time: "00:00:00",scoreHistory:[], driverProficiency: [] });
  const [fetching, setFetching] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [isFirstLoad, setFirstLoad] = useState(true);
  let currentUser = getCurrentUser();
  useEffect(() => {
   // fetchDeviceHistory();
  }, []);

  const [metricsStatus, setMs] = useState([{ title: "Speeding Events Count", status: 0, total: 100 },
  { title: "Speeding Time", status: 0, total: 100 },
  { title: "Harsh Breaking Events Count", status: 0, total: 100 },
  { title: "Harsh Acceleration Events Count", status: 0, total: 100 },
  { title: "Harsh Cornering Events Count", status: 0, total: 100 }]);

  const fetchDeviceHistory = () => {
    axios.get(
      `${serverUrl}/device_performance?user_hash=${currentUser ? currentUser.user_api_hash : ''}
            &startDate=${startDateRange}&endDate=${endDateRange}&deviceId=${deviceId}`
    )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setFirstLoad(false);
        setDeviceData(data);
        setMs([{ title: "Speeding Events Count", status: data.speedingCount, total: 100 },
        { title: "Harsh Braking Events Count", status: data.harshBrakingCount, total: 100 },
        { title: "Harsh Acceleration Events Count", status: data.harshAccelerationCount, total: 100 },
        { title: "Harsh Cornering Events Count", status: data.harshCorneringCount, total: 100 }])
        setFetching(false);
      });

  }

  const performSearch = () => {
    fetchDeviceHistory();
  }

  const generateReport = () => {
    if(downloading){
        return;
    }
  
    const parameters = {
        startDate: startDateRange,
        endDate: endDateRange,
        device_score: deviceData.score || 0,
        average_score: deviceData.avgScore || 0,
        max_score: deviceData.bestScore || 0,
        deviceId: deviceId
    };
    const data = {
        reportName: "gps_driver_template",
        reportFormat: 'pdf',
        parameters: parameters
    };

    let reportFormat = 'application/pdf';
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
      console.log(error);
  });
}

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.device-page" match={props.match} />
          <Separator className="mb-4" />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs="12" className="mb-2">
          <h3><b>{driverName}</b> - {deviceName} </h3>
        </Colxx>
      </Row>     
      <Row>
        <Colxx xxs="12">
        <Alert >Search by date to see driver's performance</Alert>
        </Colxx>
        <Colxx xxs="12" className="mb-2">
          <Card>
          <CardBody>
          <div className="d-block d-md-inline-block">
            <div className="search-input-sm d-inline-block float-md-left mr-1 mb-1 align-top">
              <label className="mr-1"> From: </label>
              <input
                type="date"
                name="keyword"
                id="search"
                placeholder=" From"
                className="mr-1"
                value={startDateRange}
                onChange={(e) => setStartDateRange(e.target.value)}
              />
              {' '}
            </div>
            <div className="search-input-sm d-inline-block float-md-left mr-1 mb-1 align-top">
              <label className="mr-1"> To:</label>
              <input
                type="date"
                name="keyword"
                id="search"
                placeholder=" To"
                value={endDateRange}
                className="mr-1"
                onChange={(e) => setEndDateRange(e.target.value)}
              />
            </div>

            <Button color="dark" className="mr-1" onClick={() => performSearch()}
              size="xs">
              <i className="iconsminds-magnifi-glass"></i> {' '}   Search
            </Button> {' '}
            {!isFirstLoad && 
            <Button color="info" className="mr-1" onClick={() => generateReport()}
              size="xs">
              <i className="simple-icon-printer"></i> {' '}   
              {downloading ? 'Downloading...' : 'Download Driver Performance'}
            </Button>
            }
          </div>
          </CardBody>
          </Card>
        </Colxx>
      </Row>

     

      {!isFirstLoad &&
        <Row>
          <Colxx xxs="3" className="mb-4">
            <Card color="warning">
              <CardBody className="text-center">
                <i className={"simple-icon-rocket"} />
                <p className="card-text font-weight-semibold mb-0">
                  <IntlMessages id={"Active"} />
                </p>
                <p className="lead text-center">{(deviceData.totalActive || 0) + " days"}</p>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx xxs="3" className="mb-4">
            <Card  color="light">
              <CardBody className="text-center">
                <i className={"iconsminds-location-2"} />
                <p className="card-text font-weight-semibold mb-0">
                  <IntlMessages id={"Distance"} />
                </p>
                <p className="lead text-center">{(deviceData.distance || 0) + " km"}</p>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx xxs="3" className="mb-4">
            <Card color="primary">
              <CardBody className="text-center">
                <i className={"iconsminds-clock-forward"} />
                <p className="card-text font-weight-semibold mb-0">
                  <IntlMessages id={"Ignition Time"} />
                </p>
                <p className="lead text-center">{deviceData.time || 0}</p>
              </CardBody>
            </Card>
          </Colxx>
          <Colxx xxs="3" className="mb-4">
            <Card color="secondary">
              <CardBody className="text-center">
                <i className={"iconsminds-clock-forward"} />
                <p className="card-text font-weight-semibold mb-0">
                  <IntlMessages id={"Driver's Score"} />
                </p>
                <p className="lead text-center">{deviceData.score || 0}</p>
              </CardBody>
            </Card>
          </Colxx>

        </Row>
}
{!isFirstLoad &&
      <Row>
        <Colxx xxs="6" className="mb-4" >
          <Card className={'h-100'}>
            <CardBody>
              <CardTitle>
                1. Metrics Status
              </CardTitle>
              {metricsStatus.map((s, index) => {
                return (
                  <div key={index} className="mb-4">
                    <p className="mb-2">
                      {s.title}
                      <span className="float-right text-muted">
                        {s.status}/{s.total}
                      </span>
                    </p>
                    <Progress value={(s.status / s.total) * 100} />
                  </div>
                );
              })}
            </CardBody>
          </Card>
        </Colxx>
        <Colxx xxs="6" className="mb-4">
          <Card className={'h-100'}>
            <CardBody>
              <CardTitle>
                2. Proficiency
              </CardTitle>
              <div className="chart-container">
                <BarChart shadow data={deviceData.driverProficiency} />
              </div>
            </CardBody>
          </Card>
        </Colxx>
        <Colxx xxs="6" className="mb-4">
          <Card className={'h-100'}>
            <CardBody>
              <CardTitle>
                3. Score Trend Over the Last 4 Weeks
              </CardTitle>
              <div className="dashboard-line-chart">
                <BarChart shadow data={deviceData.scoreHistory} />
              </div>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
      }
    </>
  );
};

export default DevicePage;