import React from "react";

export const Pagination = ({ page, totalPages, onPagechange }) => {
  return (
    <div className="flex justify-end items-center gap-4 mt-6">
      <button
        disabled={page === 1}
        onClick={() => onPagechange(page - 1)}
        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
      >
        prev
      </button>
      <spam className="font-semibold">
        {page}/{totalPages}
      </spam>

      <button
        disabled={page === totalPages}
        onClick={() => onPagechange(page + 1)}
        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
      >
        next
      </button>
    </div>
  );
};
