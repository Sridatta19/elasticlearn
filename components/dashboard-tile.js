import React from "react";
import Link from "next/link";

const DashboardTile = ({ href, title, description }) => {
  return (
    <Link href={`/${href}`}>
      <a
        className={`w-full max-w-xl md:w-snug p-6 text-left border border-gray-200 rounded-xl transition-colors hover:border-blue-600 hover:text-blue-600`}
      >
        <h3 className="mb-4 text-2xl sm:text-3xl">{title} &rarr;</h3>
        <p className="m-0 text-sm sm:text-lg leading-normal">{description}</p>
      </a>
    </Link>
  );
};

export default DashboardTile;
