import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnecdote } from "../requests";
import { useNotificationDispatch } from "./NotificationContext";

const AnecdoteForm = () => {
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

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: ({ content }) => {
      queryClient.invalidateQueries("anecdotes");
      setNotification(`new anecdote: ${content}`, 5000);
    },
    onError: ({ response }) => {
      setNotification(response.data.error, 5000);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    newAnecdoteMutation.mutate({ content, votes: 0 });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
