const Header = ({ course }) => <h2>{course.name}</h2>

const Total = ({ parts }) => {
  var initialValue = 0;
  var result = parts.map(part => part.exercises)
  var sum = result.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    initialValue
  );
  return (
    <b>total of {sum} exercises</b>
  )
}
  
const Part = ({ part }) => {
   return (
    <p>{part.name} {part.exercises}</p>
  )
    
}
 
const Content = ({ parts }) => 
  <>
  {parts.map(part => 
          <Part key={part.id} part={part} />
        )}
       
  </>

const Course = ({ course }) =>
  <>
    <Header course={course} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </>

export default Course