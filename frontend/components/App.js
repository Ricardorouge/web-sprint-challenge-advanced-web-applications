import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axiosWithAuth from "../axios";
import axios from "axios";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate("/"); /* ✨ implement */
  };
  const redirectToArticles = () => {
    navigate("/articles"); /* ✨ implement */
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem("token");
    setMessage("Goodbye!");
    redirectToLogin();
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    axios
      .post(loginUrl, { username, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setMessage(res.data.message);
        redirectToArticles();
        setSpinnerOn(false);
      })
      .catch((err) => {
        setMessage(err.response.data.message);
        setSpinnerOn(false);
      });
  };

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth()
      .get(articlesUrl)
      .then((res) => {
        // console.log(res)
        setArticles(res.data.articles);
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch((err) => {
        setSpinnerOn(false);
        err.response.status === 401 && redirectToLogin();
      });
  };

  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    axiosWithAuth()
      .post(articlesUrl, article)
      .then((res) => {
        setArticles([...articles, res.data.article]);
        setMessage(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setSpinnerOn(true);
    axiosWithAuth()
      .put(`${articlesUrl}/${article_id}`, article)
      .then((res) => {
        setArticles(
          articles.map((art) => {
            return art.article_id === article_id ? res.data.article : art;
          })
        );
        setMessage(res.data.message);
        setCurrentArticleId();

        setSpinnerOn(false);
      })
      .catch((err) => {
        setMessage(err.response.data.message);
        setSpinnerOn(false);
      });
  };

  const deleteArticle = (article_id) => {
    // ✨ implement
    setSpinnerOn(true);
    axiosWithAuth()
      .delete(`${articlesUrl}/${article_id}`)
      .then((res) => {
        setMessage(res.data.message);
        setArticles(
          articles.filter((art) => {
            return art.article_id !== article_id;
          })
        );
        setSpinnerOn(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner spinnerOn={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink
            id="articlesScreen"
            to={localStorage.getItem("token") ? "/articles" : "/"}
          >
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  article={articles.find((art) => {
                    return art.article_id === currentArticleId;
                  })}
                  updateArticle={updateArticle}
                  postArticle={postArticle}
                  setCurrentArticleId={setCurrentArticleId}
                />
                <Articles
                  articles={articles}
                  getArticles={getArticles}
                  setCurrentArticleId={setCurrentArticleId}
                  deleteArticle={deleteArticle}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  );
}
