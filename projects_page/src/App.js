import React from "react";
import './App.css';
import { Button, TextField, Grid, Box } from "@mui/material";

class App extends React.Component {
    render() {
        return (
            <Projects />
        )
    }
}

class Projects extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            projects: [
                // proj1
                {
                  name: 'Project Name 1',
                  users: ["vliew"],
                  projID: 1
                },
                //proj2
                {
                  name: 'Project Name 2',
                  users: ["asamant", "vliew"],
                  projID: 1234
                },
                // proj3
                {
                  name: 'Project Name 3',
                  users: ["vliew", "ayush", "asamant"],
                  projID: 7865
                }
              ]
        }
    }

    render() {
        return (
            <Box margin={8} padding={4} border={2}>
                <h1>Projects</h1>
                {this.state.projects.map(({ name, users, projID }) => (
                    <Project key={projID} projectName={name} projectUsers={users} />
                ))}
            </Box>
        )
    }
}

class Project extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            HWSets: [
                {
                  // Set 1
                  available: 100,
                  capacity: 100
                },
    
                {
                  // Set 1
                  available: 100,
                  capacity: 100
                },
              ],
            inProj: false
        }
    }

    renderHWSet(i) {
        return (
            <HWSet
                setNum={i+1}
                onCheckIn={(qty) => this.handleCheckIn(i, qty)}
                onCheckOut={(qty) => this.handleCheckOut(i, qty)}
                hwset={this.state.HWSets[i]}
            />
        )
    }

    handleCheckIn(i, qty) {
        if (!this.state.inProj) {
            alert("Must join project to check in hardware")
            return
        }
        let hwsets = this.state.HWSets
        hwsets[i].available += qty
        if (hwsets[i].available > hwsets[i].capacity) {
            hwsets[i].available = hwsets[i].capacity
        }
        this.setState({
            HWSets: hwsets
        })
    }

    handleCheckOut(i, qty) {
        if (!this.state.inProj) {
            alert("Must join project to check out hardware")
            return
        }
        let hwsets = this.state.HWSets
        hwsets[i].available = hwsets[i].available < qty ? 0 : hwsets[i].available - qty
        this.setState({
            HWSets: hwsets
        })
    }

    handleJoin() {
        let join = !this.state.inProj
        this.setState({
            inProj: join
        })
    }

    renderJoin() {
        return (
            <Button className="join-button" onClick={() => this.handleJoin()} variant="outlined" color="inherit">
                {this.state.inProj ? "Leave" : "Join"}
            </Button>
        )
    }

    render() {
        let users = this.props.projectUsers
        let userOut = users[0]
        for (let k = 1; k < users.length; k++) {
            userOut += ", " + users[k]
        }

        return (
            <Grid container spacing={1} border={1} padding={2} margin={2}>
                <Grid item xs={2}>
                    <h2 className="project-name">{this.props.projectName}</h2>
                </Grid>
                <Grid item xs={2}>
                    <div className="users">{userOut}</div>
                </Grid>
                <Grid item xs={7}>
                    <div className="hwsets">
                        {this.renderHWSet(0)}
                        {this.renderHWSet(1)}
                    </div>
                </Grid>
                <Grid item xs={1}>
                    {this.renderJoin()}
                </Grid>
            </Grid>
        )

        // return (
        //     <Box className="project" margin={1} padding={1} border={1}>
        //         <h2 className="project-name">{this.props.projectName}</h2>
        //         <div className="users">{userOut}</div>
        //         <div className="hwsets">
        //             {this.renderHWSet(0)}
        //             {this.renderHWSet(1)}
        //         </div>
        //         {this.renderJoin()}
        //     </Box>
        // )
    }
}

class HWSet extends  React.Component {
    constructor(props) {
        super(props)

        this.state = {
            qty: null
        }
    }

    renderCheckIn() {
        return (
            <Button className="checkin" onClick={() => this.props.onCheckIn(this.state.qty)} variant="outlined" color='inherit'>
                Check In
            </Button>
        )
    }

    renderCheckOut() {
        return (
            <Button className="checkout" onClick={() => this.props.onCheckOut(this.state.qty)} variant="outlined" color="inherit">
                Check Out
            </Button>
        )
    }

    onChange = event => {
        this.setState({
            qty: Number(event.target.value)
        })
    }

    render() {
        return (
            <Grid container spacing={1} padding={1}>
                <Grid item xs={3}>
                    HWSet{this.props.setNum}: {this.props.hwset.available}/{this.props.hwset.capacity}
                </Grid>
                <Grid item xs={4}>
                    <TextField size="small" placeholder="Enter qty" onChange={this.onChange} />
                </Grid>
                <Grid item xs={2}>
                    {this.renderCheckIn()}
                </Grid>
                <Grid item xs={3}>
                    {this.renderCheckOut()}
                </Grid>
            </Grid>
        )
    }
}

export default App;
