import axios from "axios";
import { baseUrl } from "config";
import React, { useEffect, useState } from "react";
import uuid from "react-uuid";
import styles from "./Genre.module.css";
import { SearchIcon } from "assets/icons/searchIcon";

const Genre = ({
  setShow,
  setGenreShow,
  setSelectedGenres,
  selectedGenres,
  setState,
}) => {
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState("");

  const showGenreHandle = (e) => {
    e.stopPropagation();
    setShow(true);
    setGenreShow(false);
  };

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${baseUrl}/api/v2/book/genres?q=${search}`);
      setGenres(res.data);
    })();
  }, [search]);

  return (
    <>
      <div className={styles.div_genre}>
        <div className={styles.div_inp}>
          <h1>Добавить жанры (не более 3)</h1>
          <div className={styles.search}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="search"
            />
            {!search ? (
              <label htmlFor="search" className={styles.searchLabel}>
                <SearchIcon /> Поиск
              </label>
            ) : null}
          </div>
        </div>
        <div className={styles.genre_div}>
          {genres.map((e) => {
            const handleClick = () => {
              setSelectedGenres((prev) => {
                const find = prev.find((val) => val.id === e.id);
                if (find) {
                  return prev.filter((val) => val.id !== e.id);
                }

                if (prev.length < 3) {
                  return [...prev, e];
                }
                return [...prev];
              });
              setState((prev) => {
                return {
                  ...prev,
                  genres: selectedGenres.map((genre) => genre.id),
                };
              });
            };
            return (
              <button
                onClick={handleClick}
                key={uuid()}
                className={`${styles.but_genre} ${
                  selectedGenres.some((genre) => genre.id === e.id)
                    ? styles.active
                    : ""
                }`}
              >
                {e.value}
              </button>
            );
          })}
        </div>
        <div className={styles.div_button}>
          <button
            className={`${styles.genre_but} ${
              selectedGenres.length ? styles.orange : ""
            }`}
            onClick={showGenreHandle}
          >
            Продолжить
          </button>
        </div>
      </div>
    </>
  );
};
export default Genre;
