import React, { forwardRef, useState, useEffect } from 'react';
import { Card, CardBody, Row,Col, Label, FormGroup, Modal, ModalBody, ModalHeader, ModalFooter, Button, CardTitle } from 'reactstrap';
import { Colxx, Separator } from '../../components/common/CustomBootstrap';
import Breadcrumb from '../../containers/navs/Breadcrumb';
import { serverUrl } from '../../constants/defaultValues';
import MaterialTable from "material-table";
import axios from 'axios';
import {toast, ToastContainer} from "react-toastify";
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
import ReactTagInput from "@pathofdev/react-tag-input";
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
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({emails:"", scheduleType:"", reportName:"", creator:"admin"})
  const [tags, setTags] = React.useState([])
  const [editTags, setEditTags] = React.useState([])

  const [currentData, setCurrentData] = useState();
  const [showEditModal, setShowEditModal] = useState(false);
  const toggleEditModal = () => setShowEditModal(!showEditModal);

  let currentUser = getCurrentUser();
  useEffect(() => {
    fetchSchedules();
  }, []);

  const openEditModal = (row) => {
    setCurrentData(row);
    setEditTags(row.emails.split(','));
    toggleEditModal();
  }

  const openDeleteModal = (row) => {
    if(window.confirm('Are you sure you want to delete?') == true){
      axios.delete(
        `${serverUrl}/api/report-schedules/${row.id}`
      ).then((data) => {
          fetchSchedules();
          toast.success('Report schedule deleted successfully');
        }).catch(error => {
          if(error.response.status === 409){
           // console.log(error.response.data);
            toast.error(error.response.data);
            return;
          }
         
          toast.error('An errror occured, could not delete report schedule');
        });
    }
  }

  const editSchedule = () => {
    if(isEditing){
      return;
    }
    if(!currentData.emails){
      toast.error('Enter email');
      return;
    }
    setIsEditing(true);
    axios.put(
      `${serverUrl}/api/report-schedules/${currentData.id}`, {emails: currentData.emails}
    ).then((data) => {
      setIsEditing(false);
        fetchSchedules();
        toast.success('Report schedule edited successfully');
        toggleEditModal();
      }).catch(error => {
        setIsEditing(false);
        if(error.response.status === 409){
         // console.log(error.response.data);
          toast.error(error.response.data);
          return;
        }
       
        toast.error('An errror occured, could not save report schedule');
      });

  }
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

  const createReportSchedule = () => {
    
    if(saving){
      return;
    }
    if(!formData.emails || !formData.reportName || !formData.scheduleType){
      toast.error('Enter report type');
      return;
    }
    formData["creator"] = currentUser.username;
    setSaving(true);
    axios.post(
      `${serverUrl}/api/schedule-report`, formData
    ).then((data) => {
        setSaving(false);
        fetchSchedules();
        toast.success('Report schedule created successfully');
      }).catch(error => {
        setSaving(false);
        if(error.response.status === 409){
         // console.log(error.response.data);
          toast.error(error.response.data);
          return;
        }
       
        toast.error('An errror occured, could not save report schedule');
      });
  }
  return (
    <>
    <ToastContainer />
      <Row>
        <Colxx xxs="12">
          <Breadcrumb heading="menu.report-schedule-search" match={props.match} />
          <Separator className="mb-5" />
        </Colxx>
      </Row>
      <Row className="mb-5">
      <Colxx xxs="12" >
        <Card border="success">
         
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
                                    onChange={(x) => setFormData({...formData, reportName: x.value})}
                                    options={[{ label: "Co2 Summary Report", value: "CO2_SUMMARY_REPORT" }, 
                                 //   { label: "Fuel Consumption Report", value: "FUEL_CONSUMPTION_REPORT" },
                                    { label: "Harsh Event Summary Report", value: "HARSH_EVENT_SUMMARY_REPORT" },
                                    { label: "Score Card Summary Report", value: "SCORE_CARD_SUMMARY_REPORT" }]}
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
                                    onChange={(x) => setFormData({...formData, scheduleType: x.value})}
                                    options={[{ label: "Daily", value: "DAILY" }, 
                                    { label: "Weekly", value: "WEEKLY" },
                                    { label: "Monthly", value: "MONTHLY" }]}
                                    required
                                />

              </FormGroup>
              </Col>
              <Col>
              <FormGroup>
                                <Label>
                                    Emails*
              </Label>
              <ReactTagInput 
      tags={tags} 
      placeholder="Type and press enter"
      onChange={(newTags) => {
        setFormData({...formData, emails: newTags.toString()});
        setTags(newTags);
      }
      }
      validator={(value) => {
        // Don't actually validate e-mails this way
        const isEmail = value.indexOf("@") !== -1;
        if (!isEmail) {
          toast.info("Please enter an e-mail address");
        }
        // Return boolean to indicate validity
        return isEmail;
      }}
    />
    </FormGroup>
              </Col>
                                      
            </Row>
          </CardBody>
          <CardFooter>
            <Button onClick={createReportSchedule}>
             {saving ? 'Processing...': 'Create Report Schedule'}
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
              { title: "Report Name", field: "reportName", filtering: true,render: rowData => <span>{rowData.reportName.replace(new RegExp('_', 'g'), ' ')} </span> },
              { title: "Schedule Type", field: "scheduleType" },
              { title: "Emails", field: "emails" },
              { title: "Date Created", field: "dateCreated", type:"datetime"},
              { title: "Actions", field: "actions" },
            ]}

            data={data}
            isLoading={isLoading}
            actions= {[
              {
                  icon: Edit,
                  iconProps: {color: 'primary'},
                  tooltip: 'Edit Emails',
                  onClick: (event, rowData) => openEditModal(rowData)
              },
              {
                  icon: DeleteOutline,
                  iconProps: {color: 'primary'},
                  tooltip: 'Delete Schedule',
                  onClick: (event, rowData) => openDeleteModal(rowData)
              }
                  ]}
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

      <Modal isOpen={showEditModal} toggle={toggleEditModal} size="lg">
        <ModalHeader toggle={toggleEditModal}>
            Edit Mail Recipients
      </ModalHeader>

        <ModalBody>
            <Row>
            <Col>
              <FormGroup>
                                <Label>
                                    Emails*
              </Label>
              <ReactTagInput 
      tags={editTags} 
      placeholder="Type and press enter"
      onChange={(newTags) => {
        setCurrentData({...currentData, emails: newTags.toString()});
        setEditTags(newTags);
      }
      }
      validator={(value) => {
        // Don't actually validate e-mails this way
        const isEmail = value.indexOf("@") !== -1;
        if (!isEmail) {
          toast.info("Please enter an e-mail address");
        }
        // Return boolean to indicate validity
        return isEmail;
      }}
    />
    </FormGroup>
              </Col>
                   
            </Row>
          </ModalBody>
          <ModalFooter>
          <Button onClick={editSchedule}>{isEditing ? "Processing ..." : "Save"}</Button>
          </ModalFooter>
          </Modal>
    </>
  );
};

export default ReportSchedule;
