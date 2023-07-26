function getImageURL(fileName, folderName) {
  return `http://localhost:5050/` + `images/${folderName}/` + fileName;
}

module.exports = {
  getImageURL,
};
