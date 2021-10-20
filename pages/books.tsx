import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Layout from "../components/layout";
import { BookAction } from "../lib/book/book.action";
import { BookSelector } from "../lib/book/book.selector";

import styles from "./books.module.scss";

export const Books: React.FC = () => {
  const books = useSelector(BookSelector.books);
  const dispatch = useDispatch();
  const query = useSelector(BookSelector.query);

  return (
    <Layout>
      <input
        type="search"
        value={query}
        onChange={(event) =>
          dispatch(BookAction.search.request({ query: event.target.value }))
        }
      />
      <ul>
        {books?.map((book) => (
          <li key={book.id} className={styles.bookItem}>
            {book.volumeInfo.imageLinks && (
              <img src={book.volumeInfo.imageLinks.thumbnail} />
            )}
            <h3>{book.volumeInfo.title}</h3>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Books;
