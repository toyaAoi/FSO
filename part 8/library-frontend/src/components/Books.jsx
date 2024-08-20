import { useQuery } from "@apollo/client";
import PropTypes from "prop-types";
import { ALL_BOOKS, BOOKS_BY_GENRE } from "../queries";
import { useState } from "react";

const Books = (props) => {
  const { data, loading } = useQuery(ALL_BOOKS);
  const [genre, setGenre] = useState(null);
  const { data: dataGenre, loading: loadingGenre } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre },
  });

  if (!props.show) {
    return null;
  }

  if (loading || loadingGenre) {
    return <div>loading...</div>;
  }

  const allBooks = data.allBooks;
  const booksByGenre = genre ? dataGenre.allBooks : null;

  const genres = [...new Set(allBooks.flatMap((b) => b.genres))];
  const books = genre ? booksByGenre : allBooks;

  return (
    <div>
      <h2>books</h2>

      {genre && (
        <p>
          in genre <strong>{genre}</strong>
        </p>
      )}

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
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  );
};

Books.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default Books;
