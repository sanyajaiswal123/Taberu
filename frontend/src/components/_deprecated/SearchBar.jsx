/**
 * @deprecated
 * Superseded by SearchSection.jsx (Home page unified search bar).
 * Kept for reference. Do not import or use.
 */
import { useState } from 'react';

/**
 * SearchBar Component
 * Minimal and elegant input for searching recipes by name.
 */
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 animate-fade-in">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span className="text-xl text-deep-muted group-focus-within:text-terra transition-colors duration-300">
            🔍
          </span>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for Pasta, Soup, Paneer..."
          className="w-full pl-12 pr-32 py-4 bg-cream-light border-2 border-blush/50 text-deep rounded-2xl shadow-sm focus:outline-none focus:border-terra focus:ring-4 focus:ring-terra/10 transition-all duration-300 placeholder:text-deep-muted/50 text-lg font-medium"
        />
        <button
          type="submit"
          className="absolute inset-y-2 right-2 px-6 bg-terra hover:bg-terra-dark text-cream-light rounded-xl font-medium shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
