import './App.css';
import React from 'react';
import { Box, TextField, Grid, Button, Link } from "@mui/material"
import { Navigate } from 'react-router-dom';

class NewProject extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      idInvalid: false,
      idHelper: "",
      nameInvalid: false,
      nameHelper: "",
      memberInvalid: false,
      memberHelper: 'UserIDs (excluding your own) seperated by spaces',
      valid: false
    }
  }

  isAlphanumeric(str) {
    return /^[a-z0-9]+$/i.test(str)
  }

  isAlphanumericWSpace(str) {
    return /^[a-z0-9 ]+$/i.test(str)
  }

  handleSubmit = async event => {
    event.preventDefault()
    if (this.state.nameInvalid) {
      alert("Error: " + this.state.nameHelper)
      return
    }
    if (this.state.idInvalid) {
      alert("Error: " + this.state.idHelper)
      return
    }
    if (this.state.memberInvalid) {
      alert("Error: " + this.state.memberHelper)
      return
    }

    const data = new FormData(event.currentTarget)

    try {
      const response = await fetch('/projects/newProject/create', {
        method: 'POST',
        body: data
        // nm: data.get('projnm'),
        // projid: data.get('projid'),
        // description: data.get('description'),
        // members: data.get('members')
      })
      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`)
      }

      const result = await response.json()

      console.log('result is: ', JSON.stringify(result))

      if (result.valid) {
        this.setState({
          valid: true
        })
      } else {
        alert(result.message)
      }
    } catch (err) {
      console.log(err.message)
    }

    // add to things after fetch??
  }

  handleIdChange = event => {
    let invalid = !this.isAlphanumeric(event.target.value) && event.target.value.length > 0

    this.setState({
      idInvalid: invalid,
      idHelper: (invalid) ? "Project ID must be a single alphanumeric word" : ""
    })
  }

  handleNameChange = event => {
    let invalid = !this.isAlphanumericWSpace(event.target.value) && event.target.value.length > 0

    this.setState({
      nameInvalid: invalid,
      nameHelper: (invalid) ? "Project Name must be alphanumeric" : ""
    })
  }

  handleMemberChange = event => {
    let invalid = !this.isAlphanumericWSpace(event.target.value) && event.target.value.length > 0

    this.setState({
      memberInvalid: invalid,
      memberHelper: (invalid) ? 'UserIDs are alphanumeric' : 'UserIDs (excluding your own) seperated by spaces'
    })
  }

  renderRedirect = () => {
    if (this.state.valid) {
      return (<Navigate to='/projects' />)
    }
  }

  // Elements: name, projectid, description, members, create, cancel
  render() {
    return (
      <Box className='container' >
        {this.renderRedirect()}
        <Box border={1} width={350} padding={6} margin={6} className='container' boxShadow={8} component='form' onSubmit={this.handleSubmit} >
          <h1 className='item' >New Project</h1>
          <TextField
            className='item'
            name='projnm'
            size='small'
            label='Project Name'
            margin='normal'
            required
            fullWidth
            onChange={this.handleNameChange}
            error={this.state.nameInvalid}
            helperText={this.state.nameHelper}
          />
          <TextField
            className='item'
            name='projid'
            size='small'
            label='ProjectID'
            margin='normal'
            required
            fullWidth
            onChange={this.handleIdChange}
            error={this.state.idInvalid}
            helperText={this.state.idHelper}
          />
          <TextField
            className='item'
            name='description'
            size='small'
            label='Project Description'
            margin='normal'
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            className='item'
            name='members'
            size='small'
            label='Project Members'
            margin='normal'
            fullWidth
            multiline
            onChange={this.handleMemberChange}
            helperText={this.state.memberHelper}
            error={this.state.memberInvalid}
          />
          <Grid container justifyContent='flex-end' ><Button type='submit' variant='outlined' >Create Project</Button></Grid><br/>
          <Link href='/projects' >Cancel</Link>
        </Box>
      </Box>
    )
  }
}

export default NewProject
