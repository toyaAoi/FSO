import PropTypes from "prop-types";
import { useField } from "../hooks";

const CreateNew = ({ addNew }) => {
  const content = useField("text");
  const author = useField("text");
  const info = useField("text");

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });
  };

  const clearForm = (e) => {
    e.preventDefault();
    content.reset();
    author.reset();
    info.reset();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input
            value={content.value}
            type={content.type}
            onChange={content.onChange}
          />
        </div>
        <div>
          author
          <input
            value={author.value}
            type={author.type}
            onChange={author.onChange}
          />
        </div>
        <div>
          url for more info
          <input value={info.value} type={info.type} onChange={info.onChange} />
        </div>
        <button type="submit">create</button>
        <button type="reset" onClick={clearForm}>
          reset
        </button>
      </form>
    </div>
  );
};

CreateNew.propTypes = { addNew: PropTypes.func.isRequired };

export default CreateNew;
