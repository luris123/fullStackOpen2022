import Person from "./Person";


const Persons = ({persons, filter, handleDeleteName}) => {
    return (
      <>
          <ul>{persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
                      .map((person) => (
                        <Person
                          key={person.id + 1}
                          person={person}
                          handleDeleteName={handleDeleteName}
                        />
                      ))}</ul>

    </>  
    )
    
}

export default Persons