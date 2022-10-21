import "https://deno.land/x/xhr@0.2.1/mod.ts";

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import { MovieDb, SearchMovieRequest } from "https://esm.sh/moviedb-promise@3.2.0"

console.log("starting movie-search edge function")

serve(async (req) => {
  const { movie } = await req.json()

  const apiKey = Deno.env.get('TMDB_API_KEY')
  if (apiKey === undefined) {
    console.error("TMDB API key is not set")
    return new Response(JSON.stringify({ error: "internal server error" }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }

  const moviedb = new MovieDb(apiKey)

  const findMovie = async (search: SearchMovieRequest) => {
    console.log("searching for movies")
    const res = await moviedb.searchMovie(search)
    return res
  }

  try {
    const search = { query: movie }
    const results = await findMovie(search)
    console.log("add results to response")
    console.log(results)
    return new Response(
      JSON.stringify(results),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (e) {
    console.error(e.message)
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

