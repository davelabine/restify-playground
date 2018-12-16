// CAUTION!!!
// This is super evil in the JS world and only useful for learning \ debugging.
// I can't think of any situation you'd want this in production.

module.exports.sleepPromise = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  