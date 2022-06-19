import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import personService from './services/person'
import Notification from './components/Notification'
import Error from './components/Error'
import { useState } from 'react'
import { useEffect } from 'react'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }

    setNewName('')
    setNewNumber('')

    const existingPerson = persons.find(p => p.name === newPerson.name)
    if ( existingPerson ) {
      const ok = window.confirm(`${existingPerson.name} is already added to phonebook, update the number?`)
      if ( ok ) {

        personService.update(existingPerson.id, {...existingPerson, number: newNumber }).then(savedPerson => {
          setPersons(persons.map(p => p.id === existingPerson.id ? savedPerson : p ))
          setMessage(`Updated info of ${savedPerson.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        
        .catch(error => {
          setErrorMessage(
            `the person '${existingPerson.name}' was had already been from the server`, 'alert'
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })

        return 
      }
    }

    personService.create(newPerson).then(savedPerson => {
      setPersons(persons.concat(savedPerson))
      setMessage(`Added ${savedPerson.name}`)
    })
    .catch(error => {
      setErrorMessage('Person validation failed: given name (' + newPerson.name + ') is shorter than allowed length (3)')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handleDeleteName = (id) => {
    console.log(id)
    const findPerson = persons.find(e => e.id === id)
    console.log(findPerson.name)
    if (window.confirm('Are you sure you want to delete ' + findPerson.name + '?')) {
      personService.remove(id)
      
      setPersons(persons.filter(item => item.id !== id))
      setMessage(
        `Removed ${findPerson.name}`
      )
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Error error={errorMessage}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <h3>add a new</h3>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} handleDeleteName={handleDeleteName}/>
    </div>
  )
}

export default App