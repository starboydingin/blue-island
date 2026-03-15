const express = require('express');
const path = require('path');
const app = express();
const expressLayouts = require('express-ejs-layouts');

const { loadArtists, loadSingles, loadAlbums, loadTeam, findArtist, findAlbum, findsingle } = require('./utils/config');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.set('layout', 'layouts/main-layout');

app.get('/', (req, res) => {
  const artists = loadArtists();

  res.render('home', {
    title: 'Blue Island',
    layout: 'layouts/main-layout',
    interactive: 'home',
    artists,
  });
});

app.get('/music', (req, res) => {
  const artists = loadArtists();
  const singles = loadSingles();
  const albums = loadAlbums();

  const page = parseInt(req.query.page) || 1; // Halaman saat ini
  const limit = 15;
  const artistId = req.query.artistId;
  const sort = req.query.sort || 'newest';

  const filteredSingles = artistId ? singles.filter((single) => single.artistId === artistId) : singles;

  const enrichedSingles = filteredSingles.map((single) => {
    const artist = artists.find((artist) => artist.id === single.artistId);
    return {
      ...single,
      artistName: artist ? artist.name : 'Unknown Artist',
      artistImage: artist ? artist.images[0].path : '/',
    };
  });

  if (sort === 'newest') {
    enrichedSingles.sort((a, b) => b.realease - a.realease);
  }

  if (sort === 'oldest') {
    enrichedSingles.sort((a, b) => a.realease - b.realease);
  }

  if (sort === 'desc') {
    enrichedSingles.sort((a, b) => b.name.localeCompare(a.name));
  }

  if (sort === 'asc') {
    enrichedSingles.sort((a, b) => a.name.localeCompare(b.name));
  }

  const totalPage = Math.ceil(enrichedSingles.length / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};
  results.next = null;
  results.previous = null;

  if (endIndex < enrichedSingles.length) {
    results.next = {
      page: page + 1,
      artistId,
      sort,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      artistId,
      sort,
    };
  }

  results.singles = enrichedSingles.slice(startIndex, endIndex);
  results.currentPage = page;
  results.artistId = artistId;
  results.sort = sort;
  results.totalPage = totalPage;

  res.render('music', {
    title: 'Blue Island - Music',
    layout: 'layouts/main-layout',
    interactive: 'music',
    artists,
    albums,
    ...results,
  });
});

app.get('/business', (req, res) => {
  res.render('business', {
    title: 'Blue Island - Business',
    layout: 'layouts/main-layout',
    interactive: 'business',
  });
});

app.get('/jus', (req, res) => {
  res.render('merchandise', {
    title: 'Blue Island - Merchandise',
    layout: 'layouts/main-layout',
    interactive: 'merchandise',
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Blue Island - Contact',
    layout: 'layouts/main-layout',
    interactive: 'contact',
  });
});

app.get('/about', (req, res) => {
  const team = loadTeam();

  res.render('about', {
    title: 'Blue Island - About',
    layout: 'layouts/main-layout',
    interactive: 'about',
    team,
  });
});

app.get('/talent/:username', (req, res) => {
  const artist = findArtist(req.params.username);
  if (!artist) {
    return res.status(404).render('contact', {
      title: 'Blue Island - Not Found',
      layout: 'layouts/main-layout',
      interactive: 'contact',
    });
  }

  const album = findAlbum(artist.id);
  const single = findsingle(artist.id);

  res.render('talent', {
    title: `Blue Island - ${artist.name}`,
    layout: 'layouts/main-layout',
    interactive: 'talent',
    artist,
    album,
    single,
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server Running Port ${port}`);
  });
}

module.exports = app;
