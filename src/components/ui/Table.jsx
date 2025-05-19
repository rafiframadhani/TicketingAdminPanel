import React from "react";

export function Table({ children, className }) {
  return <table className={`w-full border border-gray-200 rounded-md ${className}`}>{children}</table>;
}

export function TableHeader({ children }) {
  return <thead className="bg-gray-100">{children}</thead>;
}

export function TableRow({ children }) {
  return <tr className="border-b border-gray-200">{children}</tr>;
}

export function TableHead({ children }) {
  return (
    <th className="p-3 text-left text-sm font-semibold text-gray-700">
      {children}
    </th>
  );
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableCell({ children }) {
  return <td className="p-3 text-sm text-gray-800">{children}</td>;
}
