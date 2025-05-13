import Image from 'next/image';
import Link from 'next/link';
import PokemonDetailClient from './PokemonDetailClient';

interface PokemonParams {
  id: string;
}

export default async function PokemonDetail({ params }: { params: PokemonParams }) {
  // In Next.js 15, params is a Promise that needs to be awaited
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  try {
    const response = await fetch(`https://nestjs-pokedex-api.vercel.app/pokemons/${id}`, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Pokemon not found');
    }
    
    const pokemon = await response.json();
    
    return <PokemonDetailClient pokemon={pokemon} />;
  } catch (error) {
    return (
      <div className="container text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="mb-4">Failed to load Pokémon data</p>
        <Link href="/" className="bg-blue-500 text-white p-4 rounded">
          Back to Pokédex
        </Link>
      </div>
    );
  }
}
