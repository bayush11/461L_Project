import React from "react";
import './App.css';
import { Button, TextField, Grid, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

class Projects extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            adminList: [""],
            memberList: [""],
            projectsLoaded: false,
            mainProjectID: '',
            mainProject: {
                Name: '',
                Description: '',
                Members: '',
                HWsets: [
                    {
                        capacity: 500,
                        available: 0
                    }, {
                        capacity: 500,
                        available: 0
                    }
                ]
            },
            selectProject: '--Select a Project--',
            loadingProject: false,
            loadingProjectsList: false,
            mainLoaded: false,
            loadingCheckIn: false,
            loadingCheckOut: false
        }
    }

    handleSelectChange = event => {
        this.setState({
            selectProject: event.target.value
        })
    }

    handleCheckIn = async (i, qty) => {
        if (qty == null) {
            alert('Enter quantity into corresponding field')
            return
        }
        this.setState({
            loadingCheckIn: true
        })

        let projid = JSON.stringify(this.state.mainProjectID).replaceAll('"', '')
        let amount = JSON.stringify(qty).replaceAll('"', '')
        let setNum = JSON.stringify(i)
        const url = ['/projects', 'checkIn', projid, setNum, amount].join('/')
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

            // Available, CheckedIn
            let project = this.state.mainProject
            project.HWsets[i].available = result.Available
            this.setState({
                mainProject: project
            })

            // TODO: alert amount checked in
            // alert('', result.CheckedIn, ' Checked in')

        } catch (err) {
            console.log(err.message)
        } finally {
            this.setState({
                loadingCheckIn: false
            })
        }
    }

    handleCheckOut = async (i, qty) => {
        if (qty == null) {
            alert('Enter quantity into corresponding field')
            return
        }
        this.setState({
            loadingCheckOut: true
        })

        let projid = JSON.stringify(this.state.mainProjectID).replaceAll('"', '')
        let amount = JSON.stringify(qty).replaceAll('"', '')
        let setNum = JSON.stringify(i)
        const url = ['/projects', 'checkOut', projid, setNum, amount].join('/')
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

            let project = this.state.mainProject
            project.HWsets[i].available = result.Available
            this.setState({
                mainProject: project
            })

            // TOOD: alert amount checked out
            // alert('', result.CheckedOut, ' Checked out')

        } catch (err) {
            console.log(err.message)
        } finally {
            this.setState({
                loadingCheckOut: false
            })
        }
    }

    joinProject = async () => {
        if (this.state.selectProject == '--Select a Project--') {
            alert("Must select a Project to join")
            return
        }

        this.setState({
            loadingProject: true
        })

        let projid = JSON.stringify(this.state.selectProject).replaceAll('"', '')
        const url = ['/projects', 'join', projid].join('/')
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

            const proj = this.state.mainProject
            proj.Name = result.Name
            proj.Description = result.Description
            proj.Members = result.Members.join(', ')
            proj.HWsets[0].available = Number(result.HW1.Availability)
            proj.HWsets[1].available = Number(result.HW2.Availability)

            this.setState({
                mainProject: proj,
                mainLoaded: true,
                mainProjectID: this.state.selectProject
            })
        } catch (err) {
            console.log(err.message)
        } finally {
            this.setState({
                loadingProject: false
            })
        }
    }

    loadProjectList = async () => {
        this.setState({
            loadingProjectsList: true
        })

        try {
            const response = await fetch('/projects/list', {
                method: 'GET'
            })
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`)
            }

            const result = await response.json()
            
            console.log('result is: ', JSON.stringify(result))
            console.log(result.AdminProjs)
            console.log(result.UserProjs)

            // TODO: setState with list info
            this.setState({
                projectsLoaded: true,
                adminList: result.AdminProjs,
                memberList: result.UserProjs
            })

        } catch (err) {
            console.log(err.message)
        } finally {
            this.setState({
                loadingProjectsList: false
            })
        }
    }

    render() {
        if (!this.state.projectsLoaded && !this.state.loadingProjectsList) {
            this.loadProjectList()
        }
        
        return(
            <Box margin={6} maxWidth >
                <h1>Projects</h1><br/>
                <Grid container justifyContent="flex-start" direction='row' >
                    <Grid item xs={8} >
                        <FormControl >
                            <InputLabel id="projectsLabel" >ProjectID</InputLabel>
                            <Select label='ProjectID' labelId="projectsLabel" value={this.state.selectProject} onChange={this.handleSelectChange} size="small" >
                                <MenuItem value='--Select a Project--' >--Select a Project--</MenuItem>
                                
                                {this.state.adminList.map(projid => <MenuItem value={projid} >{projid}</MenuItem>)}
                                {this.state.memberList.map(projid => <MenuItem value={projid} >{projid}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <> </><Button variant='outlined' onClick={this.joinProject} >Join Project</Button>
                    </Grid>
                    {/* <Grid item xs={6} ><Button variant='outlined' onSubmit={this.joinProject} >Join Project</Button></Grid> */}
                    <Grid item xs={4} ><Button href='/projects/newProject' variant='outlined' >Create New Project</Button></Grid>
                </Grid>

                <Project
                    proj={this.state.mainProject}
                    loaded={this.state.mainLoaded}
                    onCheckIn={(i, qty) => this.handleCheckIn(i, qty)}
                    onCheckOut={(i, qty) => this.handleCheckOut(i, qty)}
                />
            </Box>
        )
    }
}

class Project extends React.Component {
    // constructor(props) {
    //     super(props)

    //     this.state = {

    //     }
    // }

    renderHWset(i) {
        return (
            <HWSet
                setNum={i+1}
                onCheckIn={(qty) => this.props.onCheckIn(i, qty)}
                onCheckOut={(qty) => this.props.onCheckOut(i, qty)}
                hwset={this.props.proj.HWsets[i]}
            />
        )
    }

    render() {
        if (this.props.loaded) {
            return (
                <Box border={1} margin={6} padding={3} >
                    <h2>{this.props.proj.Name}</h2>
                    <p>Project Description: {this.props.proj.Description}</p><br/>
                    <Box margin={3} >
                        <Grid container >
                            {this.renderHWset(0)}
                            {this.renderHWset(1)}
                        </Grid>
                    </Box>
                </Box>
            )
        } else {
            return
        }
    }
}

class HWSet extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            qty: null
        }
    }

    onChange = event => {
        this.setState({
            qty: event.target.value
        })
    }

    render() {
        return (
            <Grid container spacing={1} >
                 <Grid item xs={3}>
                        HWSet{this.props.setNum}: {this.props.hwset.available}/{this.props.hwset.capacity}
                    </Grid>
                    <Grid item xs={4}>
                        <TextField size="small" placeholder="Enter qty" onChange={this.onChange} type="number" />
                    </Grid>
                    <Grid item xs={2}>
                        <Button onClick={() => this.props.onCheckIn(this.state.qty)} variant="outlined" >Check In</Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button onClick={() => this.props.onCheckOut(this.state.qty)} variant="outlined" >Check Out</Button>
                    </Grid>
            </Grid>
        )
    }
}

export default Projects
