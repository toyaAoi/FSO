import { useQuery } from "@apollo/client";
import PropTypes from "prop-types";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const { data, loading } = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  const books = data.allBooks;

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Books.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default Books;
