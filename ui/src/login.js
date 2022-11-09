import './App.css';
import React from "react";
import { Box, Button, Grid, Link, TextField } from "@mui/material"
import { Navigate } from 'react-router-dom';

//  Using react elements
class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      passInvalid: false,
      passErr: "",
      passText: "",
      idInvalid: false,
      idHelper: "",
      showPass: false,
      valid: false
    }
  }

  // Form submission handler
  handleSubmit = async event => {
    event.preventDefault()
    if (this.state.idInvalid) {
      alert("Error: " + this.state.idHelper)
      return
    }
    if (this.state.passInvalid) {
      alert("Error: " + this.state.passErr)
      return
    }

    const data = new FormData(event.currentTarget)

    try {
      const response = await fetch('/login/start', {
        method: 'POST',
        body: data
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
  }

  isAlphanumeric(str) {
    return /^[a-z0-9]+$/i.test(str)
  }

  // Password field updated
  handlePassChange = event => {
    let invalid = event.target.value.includes(" ") || event.target.value.includes("!")
    this.setState({
      passInvalid: invalid,
      passErr: (invalid) ? 'Space and "!" not allowed in password' : "",
      passText: event.target.value
    })
  }

  // Confirm Password field updated


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
        <h1> Login </h1>
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

          <Grid justifyContent="flex-end" container ><Button type='submit' variant='outlined' >Continue </Button></Grid><br/>
          <Link href='/newUser' >Dont have an account? Sign up!</Link>
        </Box>
      </Box>
  )}
}

export default Login;
