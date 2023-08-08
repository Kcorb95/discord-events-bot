module.exports = (filteredWords, str) => { // eslint-disable-line arrow-body-style
    return filteredWords ? filteredWords.some(word => str.toLowerCase().includes(word)) : false;
};