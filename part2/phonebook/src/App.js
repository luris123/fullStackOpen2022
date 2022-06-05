import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import personService from './services/person'
import Notification from './components/Notification'
import { useState } from 'react'
import { useEffect } from 'react'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const ids =persons.map(person => {
      return person.id
    })
    const nameObject = {
      name: newName,
      number: newNumber,
      id: Math.max(...ids) + 1
    }
    if (persons.some(e => e.name === newName)) {
      if (window.confirm(newName + ' is already added to phonebook, replace the old number with a new one?')) {
        console.log(nameObject.id -2)

        personService
          .update(nameObject.id -2, nameObject)
          .then(res => {
            setPersons(persons.map(p => p.id !== nameObject.id -2 ? p : res))
      })
            setNewName('')
            setNewNumber('')
            setMessage(
              `Updated ${nameObject.name}`
            )
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          
      }
    } 
    else {
      personService
        .create(nameObject)
        .then(initialPersons => {
          setPersons(persons.concat(initialPersons))
          setNewName('')
          setNewNumber('')
          setMessage(
            `Added ${nameObject.name}`
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
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
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <h3>add a new</h3>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} handleDeleteName={handleDeleteName}/>
    </div>
  )
}

export default App