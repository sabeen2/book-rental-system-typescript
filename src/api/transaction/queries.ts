import { useMutation, useQuery } from "react-query";

import { TransactionAddRequest } from "../../schema/transaction.schema";
import transaction from "./query-details";
import { makeHttpRequest } from "../../utils/http/make-http-request";
import {  TransactionUpdateRequest } from "../../schema/transaction.schema";
import { makeExcelRequest } from "../../utils/http/make-excel-download";
import { CategoryUploadRequest } from "../../schema/category.schema";
 
const { fetchAllTransaction,fetchActiveTransaction , addTransaction, deleteTransaction, updateTransaction, findTransactionById,mailDueTransaction, downloadTransactionDetails,handleTransactionDataUpload } = transaction;

export const useFetchAllTransaction = () => {
  return useQuery([fetchAllTransaction.queryKeyName], () => {
    return makeHttpRequest(fetchAllTransaction);
  });
};
export const useFetchTransaction = () => {
  return useQuery([fetchActiveTransaction.queryKeyName], () => {
    return makeHttpRequest(fetchActiveTransaction);
  });
};
 
export const useAddTransaction = () => {
   return useMutation((requestData:TransactionAddRequest)=> {
    return makeHttpRequest(addTransaction,{
        requestData
    })
   })
  }

  export const useDeleteTransaction = () => {
    return useMutation(
      (transactionID:number)=> {
     return makeHttpRequest(deleteTransaction,{
        params:{
          id:transactionID
        }
     })
    })
   }


   export const useupdateTransaction = () => {
    return useMutation(
      (requestData:TransactionUpdateRequest)=> {
     return makeHttpRequest(updateTransaction,{
         requestData
     })
    })
   }

   export const useFindTransactionById = (searchedTransactionId:number) => {
    return useQuery([findTransactionById.queryKeyName], () => {
        return makeHttpRequest(findTransactionById, {
            params:{
                id: searchedTransactionId
            }
        });
    },
    {
      enabled:searchedTransactionId?true:false
    });
};

// export const useDownloadTransactionDetails = () => {
//   return useMutation(()=> {
//     return makeExcelRequest(downloadTransactionDetails)
//   });
// }

export const useDownloadTransactionDetails = () => {
  return useQuery([downloadTransactionDetails.queryKeyName], () => {
    return makeExcelRequest(downloadTransactionDetails);
  });
};

export const useUploadTransactionDetails = () => {
  return useMutation((requestData:CategoryUploadRequest)=> {
    return makeExcelRequest(handleTransactionDataUpload, {
      requestData
    })
  })
}

export const useMailDueTransaction = () => {
  return useMutation( () => {
    return makeHttpRequest(mailDueTransaction);
  });
};

