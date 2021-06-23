import './App.css'
import { useState, useEffect } from 'react'

import app from './firebase'
const db = app.firestore()

function App() {

  // State management
  const [ action, setAction ] = useState( 'login' )
  const [ email, setEmail ] = useState( '' )
  const [ password, setPassword ] = useState( '' )
  const [ user, setUser ] = useState()
  const [ loading, setLoading ] = useState( true )
  const [ address, setAddress ] = useState( '' )

  // Listen to the user state
  useEffect( f => {

    // Listen to user
    console.log( 'Add user listener' )
    app.auth().onAuthStateChanged( user => {
      console.log( 'User changed to ', user )
      setUser( user )
      setLoading( false )
    } )

  }, [] )

  useEffect( f => {

    // No user? Exit
    if( !user ) return

    // User logged in? Get data
    return db.collection( 'addresses' ).doc( user.email ).onSnapshot( doc => {
      const data = doc.data()
      setAddress( data.address )
    } )


  }, [ user ] )

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

  // Handle address submit
  async function onAddressSubmit( e ) {

    e.preventDefault()
    console.log( 'Address save triggered: ', address )

    await db.collection( 'addresses' ).doc( user.email ).set( {
      address: address
    } )

  }

  // Loading screen
  if( loading ) return <main>
    <p>🕵️‍♀️ Loading...</p>
  </main>

  // There is a user logged in
  if( user ) return <main>
    
    <h1>Hello { user.email }</h1>
    <input onChange={ e => setAddress( e.target.value ) } type="text" value={ address } placeholder="Type your address" />
    <input onClick={ onAddressSubmit } value="save" type="submit" />

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
