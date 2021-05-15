import React from 'react';

function Recipe({ recipe }) {
  const { title, imageUrl, url, dateAdded } = recipe;
  return (
    <div className='Recipe-wrapper'>
      <p>
        Here is your dinner recipe! If you don't like it you can always look for another one! 👍
      </p>
      <div className='Recipe-container'>
        <div className='Recipe'>
          <div className='Recipe-title'>
            <a href={url} target='_open'>{title}, added on {dateAdded}.</a>
          </div>
          <img src={imageUrl} alt='recipe' />
        </div>
      </div>
    </div>
  );
}

export default Recipe;