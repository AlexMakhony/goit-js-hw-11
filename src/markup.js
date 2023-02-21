export { galleryMarkup };

function galleryMarkup(data) {
  return data
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
  <a href="${largeImageURL}"> 
  <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
  </a>
  <div class="info">
    <p class="info-item">
       <b class="text property" >Likes</b>
      <b class="text value">${likes}</b>
    </p>
    <p class="info-item">
         <b class="text property">Views</b>
      <b class="text value">${views}</b>
    </p>
    <p class="info-item">
        <b class="text property">Comments</b>
      <b class="text value">${comments}</b>
    </p>
    <p class="info-item">
      <b class="text property">Downloads</b>
      <b class="text value">${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
}