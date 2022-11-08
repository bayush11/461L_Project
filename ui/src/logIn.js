import './App.css';
import React from "react";
import { Box, Button, Grid, Link, TextField } from "@mui/material"

//  Using react elements
class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      passInvalid: false,
      passErr: "",
      passText: "",
      idInvalid: false,
      idHelper: ""
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
      const response = await fetch('/login/authenticate', {
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

      alert(result.message)
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
  }


  handleIdChange = event => {
    let invalid = !this.isAlphanumeric(event.target.value) && event.target.value.length > 0

    this.setState({
      idInvalid: invalid,
      idHelper: (invalid) ? "UserID must be alphanumeric with no spaces" : ""
    })
  }

  // Elements needed: title, name, id, password, confirm password, submit(create), cancel
  render () {
    return (
      <Box className='container' >
        <Box border={1} width={350} padding={6} margin={6} className='container' boxShadow={8} component='form' onSubmit={this.handleSubmit} >
          <h1 className='item' > Log In </h1>
          
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
    
          <br/>
          <Grid justifyContent="flex-end" container ><Button type='submit' variant='outlined' >Create User</Button></Grid><br/>
          <Link href='/login'  >Cancel</Link>
        </Box>
      </Box>
  )}
}

export default Login;
