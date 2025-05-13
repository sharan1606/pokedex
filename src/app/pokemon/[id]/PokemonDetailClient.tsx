'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PokemonType {
  id: number;
  name: string;
}

interface PokemonStat {
  name: string;
  value: number;
}

interface PokemonEvolution {
  pokedexId: number;
  name: string;
  image: string;
}

interface Pokemon {
  pokedexId: number;
  name: string;
  image: string;
  types: PokemonType[];
  height: number;
  weight: number;
  stats: PokemonStat[] | Record<string, number>;
  evolutions?: PokemonEvolution[];
}

interface PokemonDetailClientProps {
  pokemon: Pokemon;
}

export default function PokemonDetailClient({ pokemon }: PokemonDetailClientProps) {
  // Format height and weight properly
  const formattedHeight = isNaN(pokemon.height) ? 'Unknown' : `${(pokemon.height / 10).toFixed(1)} m`;
  const formattedWeight = isNaN(pokemon.weight) ? 'Unknown' : `${(pokemon.weight / 10).toFixed(1)} kg`;

  // Calculate stat percentage for visual bars (max stat value is typically 255)
  const calculateStatPercentage = (value: number) => {
    const maxStatValue = 255;
    return Math.min(100, (value / maxStatValue) * 100);
  };

  // Convert stats to array if it's an object
  const statsArray = Array.isArray(pokemon.stats) 
    ? pokemon.stats 
    : Object.entries(pokemon.stats).map(([name, value]) => ({ 
        name, 
        value: typeof value === 'number' ? value : 0 
      }));

  return (
    <div className="container">
      <Link href="/" className="inline-flex items-center mb-6 text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Pokédex
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg">
        {/* Pokemon Header */}
        <div className="bg-gray-100 p-8 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
            <Image
              src={pokemon.image}
              alt={pokemon.name}
              width={250}
              height={250}
              className="object-contain"
              style={{ width: 'auto', height: 'auto', maxWidth: '250px', maxHeight: '250px' }}
            />
          </div>
          
          <div className="w-full md:w-2/3 md:pl-8">
            <p className="text-gray-500 mb-2">#{pokemon.pokedexId.toString().padStart(3, '0')}</p>
            <h1 className="text-4xl font-bold mb-4">{pokemon.name}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {pokemon.types.map((type) => (
                <span
                  key={type.id}
                  className={`pokemon-type type-${type.name.toLowerCase()}`}
                >
                  {type.name}
                </span>
              ))}
            </div>
            
            <div className="grid">
              <div>
                <p className="text-gray-600">Height</p>
                <p className="font-semibold">{formattedHeight}</p>
              </div>
              <div className="mt-4">
                <p className="text-gray-600">Weight</p>
                <p className="font-semibold">{formattedWeight}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pokemon Stats */}
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6">Stats</h2>
          
          <div className="space-y-4">
            {statsArray.map((stat) => (
              <div key={stat.name}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium capitalize">{stat.name}</span>
                  <span className="font-medium">{stat.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${calculateStatPercentage(stat.value)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pokemon Evolutions */}
        {pokemon.evolutions && pokemon.evolutions.length > 0 && (
          <div className="p-8 border-t">
            <h2 className="text-2xl font-bold mb-6">Evolutions</h2>
            
            <div className="grid">
              {pokemon.evolutions.map((evolution) => (
                <Link
                  href={`/pokemon/${evolution.pokedexId}`}
                  key={evolution.pokedexId}
                  className="pokemon-card bg-gray-100 p-4 text-center"
                >
                  <div className="mb-4 flex justify-center">
                    <Image
                      src={evolution.image}
                      alt={evolution.name}
                      width={100}
                      height={100}
                      className="object-contain"
                      style={{ width: 'auto', height: 'auto', maxWidth: '100px', maxHeight: '100px' }}
                    />
                  </div>
                  <p className="text-gray-500 mb-1">#{evolution.pokedexId.toString().padStart(3, '0')}</p>
                  <h3 className="font-semibold">{evolution.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
