import React, { forwardRef, useState, useEffect } from 'react';
import { Row } from 'reactstrap';
import IntlMessages from '../../helpers/IntlMessages';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import Breadcrumb from '../../containers/navs/Breadcrumb';
import { serverUrl } from '../../constants/defaultValues';
import MaterialTable from "material-table";
import { Link } from 'react-router-dom';
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
import VisibilityIcon from "@material-ui/icons/Visibility";

import { getCurrentUser } from '../../helpers/Utils';

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

const DeviceSearch = (props) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let currentUser = getCurrentUser();
  useEffect(() => {
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
        setData(data.map((row) => (
          {
            ...row, deviceGroup: row.deviceGroup.name, action: <div> <Link
              to={{
                pathname: "/app/device-page",
                state: {id:row.id, name:row.name, driver_name: row.driverName}
              }}
              title={"Click to view driver's performance report"}
            >
           <VisibilityIcon /> View 
            </Link></div>
          }
        )));
      });
  }
  return (
    <>
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.device-search" match={props.match} />
          <Separator className="mb-5" />
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
            title="Device List"
            columns={[
              { title: "Device", field: "name", filtering: true },
              { title: "Driver Name", field: "driverName" },
              { title: "Fleet Name", field: "deviceGroup" },
              { title: "Last Date Modified", field: "time" },
              { title: "", field: "action" },
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

export default DeviceSearch;
