
import './App.css';
import React, {Component} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import axios from 'axios'; 
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';




export default class Transaction extends Component {
  constructor(props){
      super(props)
      this.state={
          sensor_data:[],
          data:null,
          date1Value:"",
          date2Value:"",
          statsValue:null
      }
      
      
      this.handleChangeselect = this.handleChangeselect.bind(this);
      
  }
  

  componentDidMount() {
    axios.get(`http://localhost:8000/sensor-data-list/`)
            .then((res) => {
              this.setState({sensor_data:res.data})
            })
            .catch(err => {
                console.log(err);
            });
  }


  

  handleChangeselect(id){
    
    this.setState({data:id})
    if (id==="min"){
      this.setState({data:"Minimum"})
    }
    else if(id==="max"){
      this.setState({data:"Maximum"})
    }
    else if(id==="average"){
      this.setState({data:"Average"})
    }
    axios.post(`http://localhost:8000/filter-sensor-data/`, {
      start_date: this.state.date1Value,
      end_date: this.state.date2Value,
      value:id
    }).then((res) => {
              this.setState({sensor_data:res.data["data_list"], statsValue:res.data["value"]})
            }).catch(err => {
                console.log(err);
            });
  }

  render() {
    
    return (
        <div>
          <div >
            <AppBar position="static">
              <Toolbar variant="dense">
                <IconButton edge="start"  color="inherit" aria-label="menu">
                </IconButton>
                <Typography variant="h6" color="inherit">
                  <form  noValidate>
                        <TextField
                          id="date1"
                          label="Start Date"
                          type="date"
                          defaultValue={this.state.date1Value}
                          onChange={event => {
                            const { value } = event.target;
                            this.setState({ date1Value: value });
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                    </form>
                </Typography>
                <Typography variant="h6"  m={-2} color="inherit">
                  <form  noValidate>
                        <TextField
                          id="date2"
                          label="End Date"
                          type="date"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          defaultValue={this.state.date1Value}
                          onChange={event => {
                            const { value } = event.target;
                            this.setState({ date2Value: value });
                          }}
                        />
                    </form>
                </Typography>
                
                <Typography variant="h6" color="inherit">
                    <select 
                        onChange={(f) =>this.handleChangeselect(f.target.value)}>
                          <option  value="max">Max</option>
                          <option value= "min">Min</option>
                          <option value= "average">Average</option>                
                      </select>
                  </Typography>
              </Toolbar>
            </AppBar>
          </div>
          <TableContainer component={Paper}>
            <Table className="caption table">
              <TableHead>
                <TableRow>
                  <TableCell align="center"><b>Reading Date</b></TableCell>
                  <TableCell align="center"><b>Reading Timestamp</b></TableCell>
                  <TableCell align="left"><b>Reading</b></TableCell>
                  <TableCell align="left"><b>Sensor Type</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.sensor_data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell align="center">{row.reading_date}</TableCell>
                    <TableCell align="center">{row.reading_timestamp}</TableCell>
                    <TableCell align="left">{row.reading}</TableCell>
                    <TableCell align="left">{row.sensor_type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableBody>
                <TableRow >
                
                  <TableCell align="center"><b>{this.state.data}</b></TableCell>
                  <TableCell align="center"><b>{this.state.statsValue}</b></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer> 
      </div>
    );
  }
}


