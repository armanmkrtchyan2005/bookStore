import React, { useContext, useEffect, useState } from "react";
import styles from "./Book.module.css";
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
    setChange(id);
  };

  return (
    <div className={styles.book_main}>
      {books?.map((e) => {
        return (
          <div key={e.id} className={styles.div_min_book}>
            <div className={styles.div_bottom}>
              <div className={styles.div_imag}>
                <img src={`${baseUrl}${e.img}`} alt={e.name} />
              </div>
              <div className={styles.div_main_genre}>
                <div className={styles.bookTitle}>
                  <h1>{e.name}</h1>
                  <h3>{e.authorName}</h3>
                </div>
                <div className={styles["div-genres"]}>
                  {e.restriction ? (
                    <div className={styles["div-restriction"]}>18+</div>
                  ) : null}
                  {e.genres.map(({ value }) => {
                    return <div className={styles["div-genre"]}>{value}</div>;
                  })}
                </div>
              </div>
            </div>
            <div className={styles.min_div_button}>
              <button className={styles["button-published"]}>
                Опубликовано
              </button>
              <button
                className={styles["button-edit"]}
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
