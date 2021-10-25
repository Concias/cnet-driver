import React, { forwardRef, useState, useEffect } from 'react';
import { Card, CardBody, Row,Col, Label, FormGroup, Input, Button, CardTitle } from 'reactstrap';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import Breadcrumb from '../../containers/navs/Breadcrumb';
import { serverUrl } from '../../constants/defaultValues';
import MaterialTable from "material-table";
import axios from 'axios';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import Select from 'react-select';

import { getCurrentUser } from '../../helpers/Utils';
import CardFooter from 'reactstrap/lib/CardFooter';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const ReportSchedule = (props) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let currentUser = getCurrentUser();
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = () => {
    setIsLoading(true);
    axios.get(
      `${serverUrl}/api/report-schedules?user_hash=${currentUser ? currentUser.user_api_hash : ''}`
    )
      .then((res) => {
        return res.data;
      })
      .then((data) => {
        setIsLoading(false);
        // const items = data.map((x) => x.items);
        // var merged = [].concat.apply([], items);
        setData(data);
      });
  }
  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.report-schedule-search" match={props.match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row className="mb-5">
      <Colxx xxs="12" >
        <Card>
         
          <CardBody>
          <CardTitle>Create a New Report Schedule</CardTitle>
            <Row>
            <Col md={6}>
            <FormGroup>
                                <Label>
                                    Select Report*
              </Label>
              <Select
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    name="report"
                                    options={[{ label: "Co2 Summary Report", value: "CO2_SUMMARY_REPORT" }, 
                                    { label: "Fuel Consumption Report", value: "FUEL_CONSUMPTION_REPORT" },
                                    { label: "Individual Driver Summary Report", value: "INDIVIDUAL_DRIVER_SUMMARY_REPORT" },
                                    { label: "Score Card Summary Report", value: "SCORE_CARE_SUMMARY_REPORT" }]}
                                    required
                                />

              </FormGroup>
              </Col>
              <Col md={6}>
            <FormGroup>
                                <Label>
                                    Select Schedule*
              </Label>
              <Select
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    name="report"
                                    options={[{ label: "Daily", value: "DAILY" }, 
                                    { label: "Weekly", value: "WEEKLY" },
                                    { label: "Monthly", value: "MONTHLY" }]}
                                    required
                                />

              </FormGroup>
              </Col>
                        <Col md={12}>
                            <FormGroup>
                                <Label>
                                    Emails*
              </Label>
                                <Input
                                    type="text"
                                    name="emails"
                                    id="emails"
                                    placeholder=" "
                                    multiple
                                    required
                                />
                            </FormGroup>
                        </Col>
                                      
            </Row>
          </CardBody>
          <CardFooter>
            <Button>
              Create Report Schedule
            </Button>
          </CardFooter>
        </Card>
        </Colxx>
      </Row>
      <Row>
        {/* <Colxx xxs="12" className="mb-4">
          <p>
            <IntlMessages id="menu.device-search" />
          </p>
        </Colxx> */}
        <Colxx xxs="12" className="mb-4">
          <MaterialTable
            icons={tableIcons}
            title="Report Schedule List"
            columns={[
              { title: "Report Name", field: "reportName", filtering: true },
              { title: "Schedule Type", field: "scheduleType" },
              { title: "Emails", field: "email" },
              { title: "Date Created", field: "dateCreated" },
            ]}

            data={data}
            isLoading={isLoading}
            options={{
              headerStyle: {
                backgroundColor: "#9F9FA5",
                color: "#000",
              },
              searchFieldStyle: {
                width: "300%",
                margingLeft: "250px",
              },
              filtering: true,
              exportButton: false,
              searchFieldAlignment: "left",
              actionsColumnIndex: -1,
            }}
          />
        </Colxx>
      </Row>
    </>
  );
};

export default ReportSchedule;
