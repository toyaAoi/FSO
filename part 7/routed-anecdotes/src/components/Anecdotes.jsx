import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const Anecdote = ({ anecdote }) => {
  return (
    <div>
      <h2>{anecdote.content}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>
        for more info see <a href={anecdote.info}>{anecdote.info}</a>
      </p>
    </div>
  );
};

Anecdote.propTypes = { anecdote: PropTypes.object };

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map((anecdote) => (
        <li key={anecdote.id}>
          <Link key={anecdote.id} to={`/anecdotes/${anecdote.id}`}>
            {anecdote.content}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

AnecdoteList.propTypes = { anecdotes: PropTypes.array.isRequired };

export default AnecdoteList;
