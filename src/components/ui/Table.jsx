export function Table({ children, className }) {
  return <table className={`w-full bg-white border border-gray-300 rounded-md ${className}`}>{children}</table>;
}

export function TableHeader({ children }) {
  return <thead className="bg-gray-800">{children}</thead>;
}

export function TableRow({ children }) {
  return <tr className="border-b border-gray-300">{children}</tr>;
}

export function TableHead({ children }) {
  return (
    <th className="p-3 text-left text-sm font-bold text-white">
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
