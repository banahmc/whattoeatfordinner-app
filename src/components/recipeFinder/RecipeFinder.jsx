import React, { useState } from 'react';
import runtimeEnv from '@mars/heroku-js-runtime-env';

import RecipeInfo from './RecipeInfo';

import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  }
}));

const env = runtimeEnv();
const recipeApiRandomRecipeUrl = `${env.REACT_APP_RECIPE_API_URL_BASE}${env.REACT_APP_RECIPE_API_RANDOM_RECIPE_URL}`;
const recipeFinderTilterTextDelimiterCharacter = ' ';

function RecipeFinder() {
  const classes = useStyles();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [filter, setFilter] = useState([]);

  const abortController = new AbortController();
  const abortSignal = abortController.signal;

  const findRecipeHandler = async () => {
    try {
      setError(false);
      setLoading(true);
      let url = recipeApiRandomRecipeUrl;
      if (filter.length >= 1) {
        const uniqueFilters = [...new Set(filter)];
        const params = uniqueFilters.map(f => `term=${encodeURIComponent(f)}`).join('&');
        url = `${url}?${params}`;
      }
      const response = await fetch(url, { signal: abortSignal });
      const recipe = await response.json();
      if (recipe) {
        setRecipe(recipe);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const textFilterHandler = async (event) => {
    const filterValue = event.target.value.trim();
    if (filterValue.length === 0) {
      setFilter([]);
      return;
    }
    const filterWords = filterValue.split(recipeFinderTilterTextDelimiterCharacter);
    if (filterWords.length >= 1) {
      setFilter(filterWords);
    }
  }

  return (
    <div className='RecipeFinder'>
      <p>
        You don't know <strong>What to eat for a dinner?</strong> Let me figure this out for you! 😊
      </p>
      <div className={classes.root}>
        <TextField
          variant='outlined'
          placeholder='Filter...'
          size='small'
          onChange={textFilterHandler}
          title='You can narrow down results by using filter. It accepts multiple words separated by a space.'
        />
        <Button
          variant='contained'
          onClick={findRecipeHandler}
          disabled={isLoading}
          color='primary'
        >
          find dinner recipe!
        </Button>
      </div>
      <div>
        {isLoading
          ? <CircularProgress />
          : isError
            ? 'Oops! It looks like we have encountered an error when loading your recipe! 😓'
            : recipe
              ? <RecipeInfo recipe={recipe} />
              : null}
      </div>
    </div>
  );
}

export default RecipeFinder;