const chunkAndMapToLLMPromise = async (
  array,
  chunkSize,
  asyncHandler,
  maxChunks
) => {
  let chunkedLofaf = array.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  // If maxChunks is defined, only process the first maxChunks chunks
  if (maxChunks) {
    chunkedLofaf = chunkedLofaf.slice(0, maxChunks);
  }

  const mapPromiseArray = async (arr) => {
    // Map each item to a promise
    const promises = arr.map(async (item) => {
      return asyncHandler(item);
    });

    // Wait for all promises to resolve
    const results = await Promise.all(promises);

    return results;
  };

  let processedLofaf = await mapPromiseArray(chunkedLofaf);

  return processedLofaf;
};

export default chunkAndMapToLLMPromise;
