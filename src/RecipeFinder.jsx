import React, { useState, useEffect } from 'react';
import { API_URL_RECIPE_RANDOM } from './Recipe.api';
import RecipeInfo from './RecipeInfo';

function RecipeFinder() {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const abortController = new AbortController();
  const abortSignal = abortController.signal;

  const findRecipeHandler = async () => {
    try {
      setError(false);
      setLoading(true);
      const response = await fetch(API_URL_RECIPE_RANDOM, { signal: abortSignal });
      const recipe = await response.json();
      setRecipe(recipe);
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='RecipeFinder'>
      <p>
        You don't know <strong>What to eat for a dinner?</strong> Let me figure this out for you! 😊
      </p>
      <button onClick={findRecipeHandler}>Find Dinner Recipe!</button>
      <div>
        {isError ? 'Oops! It looks like we have encountered an error when loading your recipe! 😓' : null}
        {isLoading ? 'Loading recipe....' : null}
        {recipe ? <RecipeInfo recipe={recipe} /> : null}
      </div>
    </div>
  );
}

export default RecipeFinder;