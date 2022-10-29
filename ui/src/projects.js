import React from "react";
import './App.css';
import { Button, TextField, Grid, Box } from "@mui/material";

class Projects extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            projects: [
                // proj1
                {
                  name: 'Project Name 1',
                  users: ["vliew"],
                  projID: "1"
                },
                //proj2
                {
                  name: 'Project Name 2',
                  users: ["asamant", "vliew"],
                  projID: "1234"
                },
                // proj3
                {
                  name: 'Project Name 3',
                  users: ["vliew", "ayush", "asamant"],
                  projID: "7865"
                }
              ]
        }
    }

    render() {
        return (
            <Box margin={8} padding={4} border={2}>
                <h1>Projects</h1>
                {this.state.projects.map(({ name, users, projID }) => (
                    <Project projID={projID} projectName={name} projectUsers={users} />
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
            inProj: false,
            loadingCheckIn: false,
            loadingCheckOut: false,
            loadingJoin: false,
            loadingLeave: false
        }


    }

    renderHWSet(i) {

        return (
            <HWSet
                setNum={i+1}
                onCheckIn={(qty) => this.handleCheckIn(i, qty)}
                onCheckOut={(qty) => this.handleCheckOut(i, qty)}
                hwset={this.state.HWSets[i]}
                projID={this.props.projID}
            />
        )
    }

    handleCheckIn = async (i, qty) => {
        if (qty == null) {
            alert('Enter quantity into corresponding field')
            return
        }
        this.setState({
            loadingCheckIn: true
        })

        let projID = JSON.stringify(this.props.projID).replaceAll('"', '')
        let amount = JSON.stringify(qty)
        const url = ['/projects', 'checkIn', projID, amount].join('/')
        console.log(url)
        try {
            const response = await fetch(url, {
                method: 'GET'
            })
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`)
            }
    
            const result = await response.json()
    
            console.log('result is: ', JSON.stringify(result))
    
            // TODO: setState with API info in project
            alert(result.message)
        } catch (err) {
            console.log(err.message)
        } finally {
            this.setState({
                loadingCheckIn: false
            })
        }


    }

    handleCheckOut = async(i, qty) => {
        if (qty == null) {
            alert('Enter quantity into corresponding field')
            return
        }
        this.setState({
            loadingCheckOut: true
        })

        let projID = JSON.stringify(this.props.projID).replaceAll('"', '')
        let amount = JSON.stringify(qty)
        // const url = "/projects/checkOut/" + toString(projID) + "/" + toString(qty)
        const url = ['/projects', 'checkOut', projID, amount].join('/')
        console.log(url)
        try {
            const response = await fetch(url, {
                method: 'GET'
            })
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`)
            }
    
            const result = await response.json()
    
            console.log('result is: ', JSON.stringify(result))
    
            // TODO: setState with API info in project
            alert(result.message)
        } catch (err) {
            console.log(err.message)
        } finally {
            this.setState({
                loadingCheckOut: false
            })
        }

    }

    handleJoin = async() => {

        let projID = JSON.stringify(this.props.projID).replaceAll('"', '')
        let url = ""
        let leave = this.state.inProj
        if (leave) {
            // leaving project
            this.setState({
                loadingLeave: true
            })
            url = ["/projects", "leave", projID].join('/')
        } else {
            // joining project
            this.setState({
                loadingJoin: true
            })
            url = ["/projects", "join", projID].join('/')
        }
        try {
            console.log(url)
            const response = await fetch(url, {
                method: 'GET'
            })
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`)
            }
    
            const result = await response.json()
    
            console.log('result is: ', JSON.stringify(result))
    
            // TODO: setState with API info in project
            this.setState({
                inProj: !leave
            })
            alert(result.message)
        } catch (err) {
            console.log(err.message)
        } finally {
            this.setState({
                loadingLeave: false,
                loadingJoin: false
            })
        }

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
            <>
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
            </>
        )
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
            <>
                <Grid container spacing={1} padding={1}>
                    <Grid item xs={3}>
                        HWSet{this.props.setNum}: {this.props.hwset.available}/{this.props.hwset.capacity}
                    </Grid>
                    <Grid item xs={4}>
                        <TextField size="small" placeholder="Enter qty" onChange={this.onChange} type="number" />
                    </Grid>
                    <Grid item xs={2}>
                        {this.renderCheckIn()}
                    </Grid>
                    <Grid item xs={3}>
                        {this.renderCheckOut()}
                    </Grid>
                </Grid>
            </>
        )
    }
}

export default Projects