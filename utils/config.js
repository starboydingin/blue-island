const fs = require('fs');
const path = require('path');

const readData = (fileName) => {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const loadArtists = () => {
  return readData('artists.json');
};

const loadAlbums = () => {
  return readData('album.json');
};

const loadSingles = () => {
  return readData('singles.json');
};

const loadTeam = () => {
  return readData('team.json');
};

const findArtist = (username) => {
  const artists = loadArtists();
  const artist = artists.find((data) => data.username === username.toLowerCase());
  return artist;
};

const findAlbum = (artistId) => {
  const albums = loadAlbums();
  const album = albums.filter((data) => data.artistId === artistId);
  return album;
};

const findsingle = (artistId) => {
  const singles = loadSingles();
  const single = singles.filter((data) => data.artistId === artistId);
  return single;
};

module.exports = { loadArtists, loadSingles, loadAlbums, loadTeam, findArtist, findAlbum, findsingle };
