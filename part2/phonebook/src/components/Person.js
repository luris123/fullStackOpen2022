const Person = ({ person, handleDeleteName }) => {
    return (
        <li>
            {person.name} {person.number} <button onClick={() => handleDeleteName(person.id)}>delete</button>

        </li>
    )
}

export default Person