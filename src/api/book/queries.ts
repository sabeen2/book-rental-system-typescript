import { useMutation, useQuery } from "react-query";

import book from "./query-details";
import { makeHttpRequest } from "../../utils/http/make-http-request";
import {
  BookUpdateRequest,
  BookAddRequest,
} from "../../schema/book.schema";
import { makeExcelRequest } from "../../utils/http/make-excel-download";

const {
  fetchBook,
  addBook,
  deleteBook,
  updateBook,
  findBookById,
  getBookImageById,
  // downloadBookDetails,
  // handleBookDataUpload
} = book;

export const useFetchBook = () => {
  return useQuery([fetchBook.queryKeyName], () => {
    return makeHttpRequest(fetchBook);
  });
};

export const useAddBook = () => {
  return useMutation((requestData: BookAddRequest) => {
    return makeExcelRequest(addBook, {
      requestData,
    });
  });
};

export const useDeleteBook = () => {
  return useMutation((bookID: number) => {
    return makeHttpRequest(deleteBook, {
      params: {
        id: bookID,
      },
    });
  });
};

export const useupdateBook = () => {
  return useMutation((requestData: BookUpdateRequest) => {
    return makeHttpRequest(updateBook, {
      requestData,
    });
  });
};

export const useFindBookById = (searchedBookId: number) => {
  return useQuery(
    [findBookById.queryKeyName],
    () => {
      return makeHttpRequest(findBookById, {
        params: {
          id: searchedBookId,
        },
      });
    },
    {
      enabled: searchedBookId ? true : false,
    }
  );
};

export const useFindBookImageById = (searchedImageId: number) => {
  return useQuery(
    [getBookImageById.queryKeyName],
    () => {
      return makeHttpRequest(getBookImageById, {
        params: {
          id: searchedImageId,
        },
      });
    },
    {
      enabled: searchedImageId ? true : false,
    }
  );
};


