import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, updateAnecdote } from "./requests";

import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useNotificationDispatch } from "./components/NotificationContext";

const App = () => {
  const dispatch = useNotificationDispatch();

  const setNotification = (content, duration) => {
    dispatch({
      type: "SET",
      payload: content,
    });
    setTimeout(() => {
      dispatch({ type: "RESET" });
    }, duration);
  };

  const queryClient = useQueryClient();
  const voteAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: ({ content }) => {
      queryClient.invalidateQueries("anecdotes");
      setNotification(`you voted: ${content}`, 5000);
    },
  });

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: false,
  });

  console.log(JSON.parse(JSON.stringify(result)));

  if (result.isLoading) {
    return <div>Loading data...</div>;
  }

  if (result.isError) {
    return <div>anecdote service note available due to problems in server</div>;
  }

  const anecdotes = result.data;

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
  };

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
