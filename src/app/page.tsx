'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [nameFilter, setNameFilter] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [hasMore, setHasMore] = useState(true);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPokemonElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Fetch Pokémon types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch('https://nestjs-pokedex-api.vercel.app/types');
        const data = await response.json();
        setTypes(data);
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };
    
    fetchTypes();
  }, []);

  // Fetch Pokémon data
  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      try {
        let url = `https://nestjs-pokedex-api.vercel.app/pokemons?page=${page}&limit=${limit}`;
        
        if (nameFilter) {
          url += `&name=${nameFilter}`;
        }
        
        if (selectedTypes.length > 0) {
          url += `&types=${selectedTypes.join(',')}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (page === 1) {
          setPokemons(data);
        } else {
          setPokemons(prevPokemons => [...prevPokemons, ...data]);
        }
        
        setHasMore(data.length === limit);
      } catch (error) {
        console.error('Error fetching pokemons:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPokemons();
  }, [page, limit, nameFilter, selectedTypes]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
    setPokemons([]);
  }, [nameFilter, selectedTypes, limit]);

  // Handle type selection
  const handleTypeChange = (typeId: number) => {
    setSelectedTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-8 text-center">Pokédex</h1>
      
      {/* Filters */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        
        <div className="grid">
          {/* Name filter */}
          <div>
            <label htmlFor="name-filter" className="block mb-2 font-medium">
              Pokémon Name
            </label>
            <input
              id="name-filter"
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Search by name..."
              className="w-full"
            />
          </div>
          
          {/* Limit filter */}
          <div className="mt-4">
            <label htmlFor="limit-filter" className="block mb-2 font-medium">
              Pokémon per page
            </label>
            <select
              id="limit-filter"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        
        {/* Type filters */}
        <div className="mt-4">
          <label className="block mb-2 font-medium">Pokémon Types</label>
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeChange(type.id)}
                className={
                  selectedTypes.includes(type.id)
                    ? `pokemon-type type-${type.name.toLowerCase()}`
                    : 'bg-gray-200 pokemon-type'
                }
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Pokémon list */}
      {pokemons.length === 0 && !loading ? (
        <div className="text-center py-8">
          <p className="text-xl">No Pokémon found matching your filters.</p>
        </div>
      ) : (
        <div className="grid">
          {pokemons.map((pokemon, index) => {
            const isLastElement = index === pokemons.length - 1;
            return (
              <Link 
                href={`/pokemon/${pokemon.pokedexId}`} 
                key={pokemon.pokedexId}
                ref={isLastElement ? lastPokemonElementRef as any : null}
                className="pokemon-card"
              >
                <div className="p-4">
                  <div className="bg-gray-100 rounded-lg p-4 mb-4 flex justify-center">
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                width={120}
                height={120}
                className="object-contain"
                style={{ width: 'auto', height: 'auto', maxHeight: '8rem' }}
                priority={index < 4} // Add priority for the first few images
              />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 mb-1">#{pokemon.pokedexId.toString().padStart(3, '0')}</p>
                    <h3 className="text-lg font-semibold mb-2">{pokemon.name}</h3>
                    <div className="flex flex-wrap justify-center gap-1">
                      {pokemon.types.map((type: any) => (
                        <span
                          key={type.id}
                          className={`pokemon-type type-${type.name.toLowerCase()}`}
                        >
                          {type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-xl">Loading more Pokémon...</p>
        </div>
      )}
    </div>
  );
}
