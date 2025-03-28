export function generatePaginationArray(
  currentPage: number,
  totalPages: number
) {
  const paginationArray = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      paginationArray.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        paginationArray.push(i);
      }
      paginationArray.push("... ");
      paginationArray.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      paginationArray.push(1);
      paginationArray.push(" ...");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        paginationArray.push(i);
      }
    } else {
      paginationArray.push(1);
      paginationArray.push(" ...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        paginationArray.push(i);
      }
      paginationArray.push("... ");
      paginationArray.push(totalPages);
    }
  }

  return paginationArray;
}
