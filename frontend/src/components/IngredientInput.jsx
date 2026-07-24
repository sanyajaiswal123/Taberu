import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getIngredientSuggestions } from '../services/api';
import { toTitleCase } from '../utils/formatText';

function IngredientInput({ onSearch, onChange }) {
  const [inputValue, setInputValue] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);
  const cacheRef = useRef(new Map());

  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.(ingredients);
  }, [ingredients]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (inputValue.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const key = inputValue.trim().toLowerCase();
      let results;
      if (cacheRef.current.has(key)) {
        results = cacheRef.current.get(key);
      } else {
        results = await getIngredientSuggestions(inputValue);
        cacheRef.current.set(key, results);
      }
      const filtered = results.filter((s) => !ingredients.includes(s.toLowerCase()));
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setHighlightIndex(-1);
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [inputValue, ingredients]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addIngredient = (value) => {
    const trimmed = (value || inputValue).trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        return;
      }
      if (e.key === 'Enter' && highlightIndex >= 0) {
        e.preventDefault();
        addIngredient(suggestions[highlightIndex]);
        return;
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
    if (e.key === 'Backspace' && inputValue === '' && ingredients.length > 0) {
      removeIngredient(ingredients.length - 1);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    if (ingredients.length > 0) onSearch?.(ingredients);
  };

  const handleClear = () => {
    setIngredients([]);
    setInputValue('');
    setSuggestions([]);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="w-full max-w-2xl mx-auto" id="ingredient-input">
      <div className="bg-surface rounded-2xl shadow-[0_8px_30px_rgb(92,61,46,0.1)] border border-blush p-md flex flex-col gap-sm">

        {/* Ingredient chips */}
        {ingredients.length > 0 && (
          <div
            role="list"
            aria-label="Added ingredients"
            className="flex flex-wrap gap-2 max-h-28 overflow-y-auto"
          >
            <AnimatePresence initial={false}>
              {ingredients.map((ingredient, index) => (
                <motion.span
                  key={ingredient}
                  role="listitem"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blush-light border border-blush text-deep font-body-sm rounded-full"
                >
                  {toTitleCase(ingredient)}
                  <button
                    onClick={() => removeIngredient(index)}
                    className="ml-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-blush transition-colors text-xs cursor-pointer"
                    aria-label={`Remove ${ingredient}`}
                  >
                    <span aria-hidden="true">✕</span>
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>

            <button
              onClick={handleClear}
              className="font-label-md text-deep-muted hover:text-terra-dark transition-colors px-2 py-1 cursor-pointer"
              id="clear-all-button"
              aria-label="Clear all added ingredients"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Text input + suggestions */}
        <div className="relative" ref={suggestionsRef}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-deep-muted/60 pl-1">kitchen</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Type an ingredient (e.g., chicken, tomato)..."
              className="flex-1 bg-transparent outline-none font-body-sm text-deep placeholder:text-deep-muted/50"
              id="ingredient-text-input"
              autoComplete="off"
              aria-label="Add an ingredient"
              aria-autocomplete="list"
              aria-controls={showSuggestions ? 'ingredient-suggestions' : undefined}
              aria-expanded={showSuggestions}
              role="combobox"
            />
            <button
              onClick={() => addIngredient()}
              disabled={!inputValue.trim()}
              className="font-label-md text-terra-dark hover:text-primary px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              id="add-ingredient-button"
            >
              + Add
            </button>
          </div>

          {/* Suggestions dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.ul
                id="ingredient-suggestions"
                role="listbox"
                aria-label="Ingredient suggestions"
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                className="absolute left-0 right-0 top-full mt-2 bg-surface border border-blush rounded-xl shadow-xl z-20 overflow-hidden list-none p-0 m-0"
              >
                {suggestions.map((suggestion, index) => (
                  <li
                    key={suggestion}
                    role="option"
                    aria-selected={index === highlightIndex}
                    onClick={() => addIngredient(suggestion)}
                    className={`w-full text-left px-4 py-2.5 font-body-sm transition-colors cursor-pointer flex items-center gap-2 ${
                      index === highlightIndex
                        ? 'bg-blush text-deep'
                        : 'text-deep hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px] text-deep-muted" aria-hidden="true">restaurant</span>
                    <span>{toTitleCase(suggestion)}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-blush" />
          <span className="font-label-md text-deep-muted uppercase tracking-wider">or search by name</span>
          <div className="flex-1 h-px bg-blush" />
        </div>

        {/* Find Recipes button */}
        <motion.button
          onClick={handleSearch}
          disabled={ingredients.length === 0}
          whileHover={ingredients.length > 0 ? { scale: 1.02, y: -2 } : {}}
          whileTap={ingredients.length > 0 ? { scale: 0.97 } : {}}
          transition={{ type: 'spring', stiffness: 360, damping: 22 }}
          className="w-full py-3 rounded-lg font-label-lg border border-blush text-deep bg-transparent hover:bg-blush-light transition-colors hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none cursor-pointer"
          id="search-recipes-button"
          aria-label={`Find recipes — ${ingredients.length} ingredient${ingredients.length !== 1 ? 's' : ''} added`}
        >
          {ingredients.length > 0
            ? `Find Recipes (${ingredients.length} ingredient${ingredients.length !== 1 ? 's' : ''})`
            : 'Find Recipes'}
        </motion.button>
      </div>
    </div>
  );
}

export default IngredientInput;
