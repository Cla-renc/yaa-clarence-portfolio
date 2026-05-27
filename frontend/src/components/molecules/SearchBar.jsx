import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass } from '@phosphor-icons/react';

const SearchBar = ({ className = '', placeholder = 'Search portfolio...' }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className={`relative flex items-center ${className}`}>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-secondary-bg border border-border rounded-full py-2.5 pl-5 pr-12 text-sm text-primary-text focus:outline-none focus:border-primary-accent transition-colors"
            />
            <button
                type="submit"
                className="absolute right-2 p-2 text-muted-text hover:text-primary-accent transition-colors rounded-full"
                aria-label="Search"
            >
                <MagnifyingGlass size={20} />
            </button>
        </form>
    );
};

export default SearchBar;
