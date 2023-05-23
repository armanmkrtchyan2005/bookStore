import { TokenContext } from "App";
import axios from "axios";
import { baseUrl } from "config";
import React, { useContext, useEffect, useState } from "react";
import uuid from "react-uuid";
import styles from "./createBook.module.css";
import { File as FileComp } from "./File/File";

async function getFileFromUrl(url, name) {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type,
  });
}

const CreateBook = ({
  files,
  setFiles,
  setShow,
  setGenreShow,
  state,
  setState,
  fileNames,
  setFileNames,
  change,
  selectedGenres,
  setSelectedGenres,
}) => {
  const [img, setImg] = useState(null);
  const { token } = useContext(TokenContext);

  const addChapterHandle = () => {
    setFileNames((prev) => [...prev, "txt, fb2 / до 2 мб"]);
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    console.log(state);
    try {
      const formData = new FormData();

      formData.append("img", state.img);
      formData.append("chapters", state.chapters);
      formData.append("name", state.name);
      formData.append("authorName", state.authorName);
      formData.append("description", state.description);
      formData.append("restriction", state.restriction);
      formData.append("genres", JSON.stringify(state.genres));
      formData.append("chapterNames", JSON.stringify(state.chapterNames));
      const { data } = await axios.post(`${baseUrl}/api/v2/book`, formData, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      console.log(data);
      setShow(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  const showGenreHandle = () => {
    setShow(false);
    setGenreShow(true);
  };

  useEffect(() => {
    if (change) {
      (async () => {
        const { data } = await axios(`${baseUrl}/api/v2/book/${change}`);
        setSelectedGenres(data.genres);
        const genres = data.genres.map((genre) => {
          return genre.id;
        });
        data.chapters.forEach(async (chapter) => {
          const a = await getFileFromUrl(chapter.dataUrl);
          console.log(a);
        });
        // console.log(files);

        setImg(`${baseUrl}${data.img}`);
        setState({ ...data, genres });
      })();
      return;
    }
  }, [change, setState, setShow, setSelectedGenres]);

  return (
    <div
      className={styles.createBook_main}
      onClick={(e) => e.stopPropagation()}
    >
      <h1>Создание книги</h1>
      <form onSubmit={submitHandle} className={styles["createBook-form"]}>
        <div className={styles.createBook_form}>
          <label htmlFor="img_file">
            <div className={styles.divInp_file}>
              <img src={img} alt="" />
              <input
                type="file"
                id="img_file"
                className={styles.inp}
                accept="image/*"
                onChange={(e) => {
                  if (!e.target.files[0]) {
                    return;
                  }
                  setState((prev) => {
                    return { ...prev, img: e.target.files[0] };
                  });
                  let reader = new FileReader();
                  reader.onload = (ev) => {
                    setImg(ev.target.result);
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }}
              />
            </div>
          </label>
          <div className={styles.divInp_form}>
            <input
              type="text"
              className={styles.divForm_inp}
              value={state.name}
              onChange={(e) =>
                setState((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
              placeholder="Название книги*"
            />
            <input
              type="text"
              className={styles.divForm_inp}
              value={state.authorName}
              onChange={(e) =>
                setState((prev) => {
                  return { ...prev, authorName: e.target.value };
                })
              }
              placeholder="Автор*"
            />
            <textarea
              cols="30"
              rows="10"
              className={`${styles.divForm_inp} ${styles.inp_all}`}
              value={state.description}
              onChange={(e) =>
                setState((prev) => {
                  return { ...prev, description: e.target.value };
                })
              }
              placeholder="Содержание"
            ></textarea>
            <div className={styles.div_limitation}>
              <input
                type="checkbox"
                checked={state.restriction}
                onChange={() =>
                  setState((prev) => {
                    return { ...prev, restriction: !prev.restriction };
                  })
                }
              />
              <span>Органичение 18+</span>
            </div>
          </div>
        </div>
        <div className={styles.div_genres}>
          {selectedGenres.length === 0 ? (
            <button type="button" onClick={showGenreHandle}>
              + Добавить жанры (не более 3)
            </button>
          ) : (
            <>
              {selectedGenres.map((e) => {
                return (
                  <button
                    onClick={() =>
                      setSelectedGenres((prev) =>
                        prev.filter((genre) => e.id !== genre.id)
                      )
                    }
                    className={styles.active}
                  >
                    {e.value}
                  </button>
                );
              })}
              {selectedGenres.length < 3 ? (
                <button onClick={showGenreHandle}>+ Добавить жанр</button>
              ) : null}
            </>
          )}
        </div>
        <div className={styles.div_formatBook}>
          <table>
            <tbody>
              {fileNames.map((val, index) => {
                return (
                  <FileComp
                    className={styles.addChap}
                    files={files}
                    setState={setState}
                    fileNames={fileNames}
                    setFiles={setFiles}
                    index={index}
                    setFileNames={setFileNames}
                    val={val}
                    key={uuid()}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        <button
          className={styles.addChapter}
          onClick={addChapterHandle}
          type="button"
        >
          + Добавить главу
        </button>

        <div className={styles.div_save}>
          <div className={styles.bookRules}>
            <input type="checkbox" />
            <p>
              Согласен с <span>правилами загрузки книг</span>
            </p>
          </div>

          <button type="submit">Сохранить и отправить на модерацию</button>
        </div>
      </form>
    </div>
  );
};
export default CreateBook;
