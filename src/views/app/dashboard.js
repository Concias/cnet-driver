import React from 'react';
import { Row, Card, CardBody } from 'reactstrap';
import IntlMessages from '../../helpers/IntlMessages';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import Breadcrumb from '../../containers/navs/Breadcrumb';
import { serverUrl } from '../../constants/defaultValues';
import axios from 'axios';
import { colors } from '../../constants/defaultValues';
import DriverPerformanceStats from './driver-performance-stat';

const Dashboard = ({ match }) => {

  const [stats,setStats] = React.useState({totalAssets: 0, totalDistance: 0});

  React.useEffect(() => {
    fetchDashboardStats();
 }, []);
  const fetchDashboardStats = () => {
    axios.get(
      `${serverUrl}/dashboard`
    )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setStats(data);
      });
  }
  const harshBrack = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Harsh Braking Count',
        borderColor: colors.themeColor1,
        pointBorderColor: colors.themeColor1,
        pointHoverBackgroundColor: colors.themeColor1,
        pointHoverBorderColor: colors.themeColor1,
        pointRadius: 2,
        pointBorderWidth: 3,
        pointHoverRadius: 2,
        fill: false,
        borderWidth: 2,
        data: [2150, 1300, 1550, 921, 1810, 1106, 1610],
        datalabels: {
          align: 'end',
          anchor: 'end',
        },
      },
    ],
  };
  const harshAcceleration = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Harsh Acceleration Count',
        borderColor: colors.themeColor1,
        pointBorderColor: colors.themeColor1,
        pointHoverBackgroundColor: colors.themeColor1,
        pointHoverBorderColor: colors.themeColor1,
        pointRadius: 2,
        pointBorderWidth: 3,
        pointHoverRadius: 2,
        fill: false,
        borderWidth: 2,
        data: [2300, 1300, 1550, 921, 1810, 1106, 1610],
        datalabels: {
          align: 'end',
          anchor: 'end',
        },
      },
    ],
  };
  const harshCorner = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Harsh Cornering Count',
        borderColor: colors.themeColor1,
        pointBorderColor: colors.themeColor1,
        pointHoverBackgroundColor: colors.themeColor1,
        pointHoverBorderColor: colors.themeColor1,
        pointRadius: 2,
        pointBorderWidth: 3,
        pointHoverRadius: 2,
        fill: false,
        borderWidth: 2,
        data: [250, 1300, 1550, 921, 1810, 1106, 1610],
        datalabels: {
          align: 'end',
          anchor: 'end',
        },
      },
    ],
  };
  const overspeed = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Overspeed Count',
        borderColor: colors.themeColor1,
        pointBorderColor: colors.themeColor1,
        pointHoverBackgroundColor: colors.themeColor1,
        pointHoverBorderColor: colors.themeColor1,
        pointRadius: 2,
        pointBorderWidth: 3,
        pointHoverRadius: 2,
        fill: false,
        borderWidth: 2,
        data: [1000, 1300, 1550, 921, 1810, 1106, 1610],
        datalabels: {
          align: 'end',
          anchor: 'end',
        },
      },
    ],
  };
  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="Dashboard" match={match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      {/* <Row>
        <Colxx xxs="12" className="mb-4">
          <p>
           Dashboard
          </p>
        </Colxx>
      </Row> */}
      <Row>
        <Colxx xxs="6" className="mb-4">
        <Card color="primary">
        <CardBody className="text-center">
          <i className={"simple-icon-chart"} />
          <p className="card-text font-weight-semibold mb-0">
            <IntlMessages id={"Total Assets"} />
          </p>
          <p className="lead text-center">{stats.totalAssets || 0}</p>
        </CardBody>
      </Card>
        </Colxx>
        <Colxx xxs="6" className="mb-4">
        <Card color="primary">
        <CardBody className="text-center">
          <i className={"simple-icon-chart"} />
          <p className="card-text font-weight-semibold mb-0">
            <IntlMessages id={"Total Distance This Week"} />
          </p>
          <p className="lead text-center">{stats.totalDistance || 0.0} km</p>
        </CardBody>
      </Card>
          </Colxx>
          {/* <Colxx xxs="3" className="mb-4">
          <Card  color="secondary">
        <CardBody className="text-center">
          <i className={"simple-icon-chart"} />
          <p className="card-text font-weight-semibold mb-0">
            <IntlMessages id={"Total Fuel Consumed"} />
          </p>
          <p className="lead text-center">3000 Litres</p>
        </CardBody>
      </Card>
          </Colxx>
          <Colxx xxs="3" className="mb-4">
          <Card inverse color="secondary">
        <CardBody className="text-center">
          <i className={"simple-icon-chart"} />
          <p className="card-text font-weight-semibold mb-0">
            <IntlMessages id={"Total CO2 Emission"} />
          </p>
          <p className="lead text-center">0</p>
        </CardBody>
      </Card>
          </Colxx> */}
      </Row>
      {/* <Row>
      <Colxx xxs="3" className="mb-4">
        <Card className={'dashboard-small-chart' }>
          <CardBody>
            <SmallLineChart data={harshCorner} />
          </CardBody>
        </Card>
      </Colxx>
      <Colxx xxs="3" className="mb-4">
        <Card className={'dashboard-small-chart' }>
          <CardBody>
            <SmallLineChart data={harshBrack} />
          </CardBody>
        </Card>
      </Colxx>
      <Colxx xxs="3" className="mb-4">
        <Card className={'dashboard-small-chart' }>
          <CardBody>
            <SmallLineChart data={harshAcceleration} />
          </CardBody>
        </Card>
      </Colxx>
      <Colxx xxs="3" className="mb-4">
        <Card className={'dashboard-small-chart'}>
          <CardBody>
            <SmallLineChart data={overspeed} />
          </CardBody>
        </Card>
      </Colxx>
      </Row>
      */}
      <DriverPerformanceStats />
    </>
  );
};

export default Dashboard;
