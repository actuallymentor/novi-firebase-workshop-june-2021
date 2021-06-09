import './App.css'
import { useState } from 'react'

import app from './firebase'

function App() {

  // State management
  const [ action, setAction ] = useState( 'login' )
  const [ email, setEmail ] = useState( '' )
  const [ password, setPassword ] = useState( '' )
  const [ user, setUser ] = useState()

  // Handle the submit
  async function onSubmit( e ) {

    // Prevent page reload
    e.preventDefault( )
    console.log( `${ action } requested with email ${ email } and password ${ password }` )

    // Do the actual registration
    try {

      if( action === 'login' ) {
        const userCredential = await app.auth().signInWithEmailAndPassword( email, password )
        console.log( 'Logged in: ', userCredential )
        setUser( userCredential.user )
      }

      if( action === 'register' ) {
        const userCredential = await app.auth().createUserWithEmailAndPassword( email, password )
        console.log( 'Registered', userCredential )
        setUser( userCredential.user )
      }

    } catch( e ) {
      console.error( 'Firebase fail: ', e )
    }

  }

  // There is a user logged in
  if( user ) return <main>
    
    <h1>Hello { user.email }</h1>

  </main>

  // No user logged in
  return <main>
    
    <h1>Hello Granny</h1>
    <h2>{ action } here:</h2>

    <form onSubmit={ onSubmit }>

      <input onChange={ e => setEmail( e.target.value ) } placeholder='your@email.com' type='email' name='email' value={ email } />
      <input onChange={ e => setPassword( e.target.value ) } placeholder='Your password' type='password' name='password' value={ password } />
      <input type='submit' value={ action } />

    </form>

    <a id='logintoggle' href='#' onClick={ f => setAction( action == 'login' ? 'register' : 'login' ) }>{ action == 'login' ? 'Register' : 'Login' } instead</a>

  </main>

}

export default App
