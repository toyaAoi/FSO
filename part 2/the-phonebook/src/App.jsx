import { useState, useEffect } from "react";
import handleData from "../handleData";

const Notification = ({ message }) => {
  const act = message?.split(" ")[0].toLowerCase();

  const activity = (act == "added" || act == "changed") && act;

  if (message === null) {
    return null;
  }

  return <div className={"notification " + activity}>{message}</div>;
};

const PersonForm = ({
  handleNewName,
  handleNewNumber,
  handleSubmit,
  newPerson,
}) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newPerson.name} onChange={handleNewName} />
        </div>
        <div>
          number: <input value={newPerson.number} onChange={handleNewNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

const Persons = ({ filtered, persons, handleDelete }) => {
  const renderPersons = filtered.length ? filtered : persons;

  return (
    <ul>
      {renderPersons.map((person) => (
        <li key={person.name} className="note">
          {person.name} {person.number}{" "}
          <button onClick={() => handleDelete(person)}>delete</button>
        </li>
      ))}
    </ul>
  );
};

const Filter = ({ handleFilter }) => {
  return (
    <div>
      filter shown with <input type="text" onChange={handleFilter} />
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newPerson, setNewPerson] = useState({ name: "", number: "" });
  const [filtered, setFiltered] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch Data
  useEffect(() => {
    handleData.getAll().then((data) => {
      setPersons(data);
    });
  }, []);

  // Event Handler Functions
  const handleFilter = (e) => {
    const searchText = e.target.value;
    const filterState = searchText.length ? true : false;
    setFiltering(filterState);

    const filteredPersons = persons.filter((person) =>
      person.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFiltered(filteredPersons);
  };

  const handleNewName = (e) => {
    const newPersonDraft = { ...newPerson, name: e.target.value };
    setNewPerson(newPersonDraft);
  };

  const handleNewNumber = (e) => {
    const newPersonDraft = { ...newPerson, number: e.target.value };
    setNewPerson(newPersonDraft);
  };

  // notification handler
  const notify = (message) => {
    setMessage(message);
    setTimeout(() => setMessage(null), 5000);
  };

  const notifyError = (person, error) => {
    if (error.response.status === 404) {
      notify(
        `Information of ${person.name} has already been removed from server`
      );
      setPersons(persons.filter((p) => p.id !== person.id));
    } else {
      notify("Something went wrong, please reload the page and try again");
    }
  };

  // handleSubmit's subfunction
  const updateData = (added, addedIndex) => {
    const personsDraft = [...persons];
    const youSure = window.confirm(
      `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
    );

    if (youSure) {
      handleData
        .update(added.id, newPerson)
        .then((data) => {
          personsDraft[addedIndex].number = data.number;

          notify(`Changed the number for ${personsDraft[addedIndex].name}`);
          setPersons(personsDraft);
          setNewPerson({ name: "", number: "" });
        })
        .catch((error) => {
          notifyError(persons[addedIndex], error);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const added = persons.find(
      (person) => person.name.toLowerCase() === newPerson.name.toLowerCase()
    );
    const addedIndex = persons.findIndex((person) => person.id === added?.id);
    const personsDraft = [...persons];

    if (!added) {
      handleData
        .create(newPerson)
        .then((data) => {
          personsDraft.push(data);
          notify(`Added ${newPerson.name} to the phonebook`);
          setPersons(personsDraft);
          setNewPerson({ name: "", number: "" });
        })
        .catch((error) => notifyError(persons[addedIndex], error));
    } else {
      updateData(added, addedIndex);
    }
  };

  const handleDelete = (person) => {
    const reallyBro = window.confirm(`Delete ${person.name}`);
    if (reallyBro) {
      handleData
        .deletePerson(person.id)
        .then((data) => {
          notify(`Deleted ${data.name} from the phonebook`);
          setPersons(persons.filter((p) => p.id !== data.id));
        })
        .catch((error) => {
          notifyError(person, error);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} />

      <Filter handleFilter={handleFilter} />

      <h2>add a new</h2>

      <PersonForm
        newPerson={newPerson}
        handleNewName={handleNewName}
        handleNewNumber={handleNewNumber}
        handleSubmit={handleSubmit}
      />

      <h2>Numbers</h2>

      {!filtered.length && filtering ? (
        <p>No number found with entered name</p>
      ) : (
        <Persons
          filtered={filtered}
          persons={persons}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default App;
