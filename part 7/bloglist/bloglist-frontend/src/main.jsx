import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

// import notificationReducer from "./reducers/notificationReduxReducer";
// import userReducer from "./reducers/userReducer";
import blogReducer from "./reducers/blogReducer";
import NotificationProvider from "./reducers/notificationReactReducer";

import App from "./App";

import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./reducers/userReactReducer";

const queryClient = new QueryClient();

const store = configureStore({
  reducer: {
    // notification: notificationReducer,
    // user: userReducer,
    blogs: blogReducer,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <NotificationProvider>
        <BrowserRouter>
          <UserProvider>
            <App />
          </UserProvider>
        </BrowserRouter>
      </NotificationProvider>
    </Provider>
  </QueryClientProvider>
);
