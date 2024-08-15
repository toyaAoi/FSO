import { useMutation, useQuery } from "@apollo/client";
import PropTypes from "prop-types";
import { ALL_AUTHORS, UPDATE_AUTHOR } from "../queries";

const Authors = (props) => {
  const { data, loading } = useQuery(ALL_AUTHORS);
  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  const authors = data.allAuthors;
  const authorsWithNoBorn = authors.filter((a) => !a.born);

  const handleSubmit = (event) => {
    event.preventDefault();
    const author = {
      name: event.target.name.value,
      born: parseInt(event.target.born.value),
    };

    updateAuthor({ variables: author });
    event.target.name.value = "";
    event.target.born.value = "";
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>set birthyear</h2>
      <form onSubmit={handleSubmit}>
        <label>
          name:{" "}
          <select name="name" required>
            {authorsWithNoBorn.map((a) => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          born: <input name="born" type="number" />
        </label>
        <br />
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

Authors.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default Authors;
