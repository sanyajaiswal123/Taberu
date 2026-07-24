import React, { useState, useEffect } from 'react';

function SearchSection({ onSearch, resetKey }) {
  const [query, setQuery] = useState('');

  useEffect(() => { setQuery(''); }, [resetKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center bg-cream-light rounded-xl border border-blush focus-within:border-terra-dark focus-within:ring-1 focus-within:ring-terra-dark transition-all p-1.5">
          <span className="material-symbols-outlined text-[20px] text-deep-muted/60 pl-2 pr-1">search</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by recipe name..."
            className="flex-1 px-2 py-2 bg-transparent border-none focus:outline-none font-body-sm text-deep placeholder:text-deep-muted/50"
            aria-label="Search by recipe name"
          />
          <button
            type="submit"
            className="font-label-md text-terra-dark hover:text-primary px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            disabled={!query.trim()}
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchSection;
