import './App.css';
import React from "react";
import { Box, Button, Grid, Link, TextField } from "@mui/material"
import { Navigate } from 'react-router-dom';

//  Using react elements
class NewUser extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      passDiff: false,
      passInvalid: false,
      diffErr: "",
      passErr: "",
      passText: "",
      diffText: "",
      nameInvalid: false,
      nameHelper: "",
      idInvalid: false,
      idHelper: "",
      valid: false
    }
  }

  // Form submission handler
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
    if (this.state.passInvalid) {
      alert("Error: " + this.state.passErr)
      return
    }
    if (this.state.passDiff) {
      alert("Error: " + this.state.diffErr)
      return
    }

    const data = new FormData(event.currentTarget)

    try {
      const response = await fetch('/newUser/create', {
        method: 'POST',
        body: data
        // nm: data.get('nm'),
        // userid: this.state.userText,
        // password: this.state.passText
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

    // fetch stuff
    // if good, go to projects
    // if not, show err
  }

  isAlphanumeric(str) {
    return /^[a-z0-9]+$/i.test(str)
  }

  isAlphabetic(str) {
    return /^[a-z ]+$/i.test(str)
  }

  // Password field updated
  handlePassChange = event => {
    let invalid = event.target.value.includes(" ") || event.target.value.includes("!")
    this.setState({
      passInvalid: invalid,
      passErr: (invalid) ? 'Space and "!" not allowed in password' : "",
      passText: event.target.value
    })

    // Check if diff between passwords
    if (this.state.diffText.length > 0 && event.target.value !== this.state.diffText) {
      this.setState({
        passDiff: true,
        diffErr: "Password entries do not match"
      })
    } else {
      this.setState({
        passDiff: false,
        diffErr: ""
      })
    }
  }

  // Confirm Password field updated
  handleDiffChange = event => {
    this.setState({
      diffText: event.target.value
    })

    if (event.target.value.length > 0 && event.target.value !== this.state.passText) {
      this.setState({
        passDiff: true,
        diffErr: " Password entries do not match"
      })
    } else {
      this.setState({
        passDiff: false,
        diffErr: ""
      })
    }
  }

  handleNameChange = event => {
    let invalid = !this.isAlphabetic(event.target.value) && event.target.value.length > 0

    this.setState({
      nameInvalid: invalid,
      nameHelper: (invalid) ? "Name field must be alphabetic" : ''
    })
  }

  handleIdChange = event => {
    let invalid = !this.isAlphanumeric(event.target.value) && event.target.value.length > 0

    this.setState({
      idInvalid: invalid,
      idHelper: (invalid) ? "UserID must be alphanumeric with no spaces" : ""
    })
  }

  renderRedirect = () => {
    if (this.state.valid) {
      return (<Navigate to='/projects' />)
    }
  }

  // Elements needed: title, name, id, password, confirm password, submit(create), cancel
  render () {
    return (
      <Box className='container' >
        {this.renderRedirect()}
        <Box border={1} width={350} padding={6} margin={6} className='container' boxShadow={8} component='form' onSubmit={this.handleSubmit} >
          <h1 className='item' >New User</h1>
          <TextField
            className='item'
            name='nm'
            size='small'
            label='Name'
            margin='normal'
            required
            fullWidth
            onChange={this.handleNameChange}
            error={this.state.nameInvalid}
            helperText={this.state.nameHelper}
          />
          <TextField
            className='item'
            name='userid'
            size='small'
            label='UserID'
            margin='normal'
            required
            fullWidth
            onChange={this.handleIdChange}
            error={this.state.idInvalid}
            helperText={this.state.idHelper}
          />
          <TextField
            className='item'
            name='password'
            size='small'
            label='Password'
            margin='normal'
            required
            fullWidth
            type={(this.state.showPass) ? 'text' : 'password'}
            onChange={this.handlePassChange}
            error={this.state.passInvalid}
            helperText={this.state.passErr}
            
          />
          <TextField
            className='item'
            name='passwordConfirm'
            size='small'
            label='Confirm Password'
            margin='normal'
            required
            fullWidth
            type={(this.state.showDiff) ? 'text' : 'password'}
            onChange={this.handleDiffChange}
            error={this.state.passDiff}
            helperText={this.state.diffErr}
          /><br/>
          <Grid justifyContent="flex-end" container ><Button type='submit' variant='outlined' >Create User</Button></Grid><br/>
          <Link href='/login' >Cancel</Link>
        </Box>
      </Box>
  )}
}

export default NewUser;
