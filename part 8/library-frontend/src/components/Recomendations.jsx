import { useQuery } from "@apollo/client";
import PropTypes from "prop-types";
import { BOOKS_BY_GENRE, FETCH_USER } from "../queries";
import { useState } from "react";

const Recommendations = ({ show, token }) => {
  const [favoriteGenre, setFavoriteGenre] = useState(null);
  const { loading } = useQuery(FETCH_USER, {
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
    onCompleted: (data) => {
      setFavoriteGenre(data.me.favoriteGenre);
    },
  });

  const { data: booksData, loading: booksLoading } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre },
  });

  if (!show) {
    return null;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  if (booksLoading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>recommendations</h2>

      <p>
        book in you favorite genre <strong>{favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksData.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Recommendations.propTypes = {
  show: PropTypes.bool.isRequired,
  token: PropTypes.string,
};

export default Recommendations;
