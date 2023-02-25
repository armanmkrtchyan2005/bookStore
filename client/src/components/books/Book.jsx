import React, { useContext, useEffect, useState } from "react";
import "./Book.css";
import axios from "axios";
import { TokenContext } from "App";
import { baseUrl } from "config";

const Book = ({ setShow, setChange }) => {
  const [books, setBooks] = useState([]);
  const { token } = useContext(TokenContext);
  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${baseUrl}/api/v2/author`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      setBooks(data.books);
    })();
  }, [token]);

  const editShow = (e, id) => {
    e.stopPropagation();
    setShow((prev) => !prev);
    console.log(id);
    setChange(id);
  };

  return (
    <div className="book_main">
      {books.map((e) => {
        return (
          <div className="div_min_book">
            <div className="div_bottom">
              <div className="div_imag">
                <img src={`${e.img}`} alt="No img" />
              </div>
              <div className="div_main_genre">
                <div className="bookTitle">
                  <h1>{e.name}</h1>
                  <h3>{e.authorName}</h3>
                </div>
                <div className="div-genre"></div>
              </div>
            </div>
            <div className="min_div_button">
              <button className="button-published">Опубликовано</button>
              <button
                className="button-edit"
                onClick={(ev) => editShow(ev, e.id)}
              >
                Редактировать
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Book;
