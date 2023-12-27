/**
 * saves current user score to local web storage
 * if user achieves a better score, the score is updated
 * @param {object} newScoreEntity {nickName: "", score: 0}
 */
export function saveScores (newScoreEntity) {
  const savedScores = localStorage.getItem('sy222ea_HighScores')

  // array of newScoreEntity objects
  let highScores

  if (savedScores) {
    highScores = JSON.parse(savedScores)
  } else {
    highScores = []
  }

  // should check if user has a score already and update it if it's better
  const userIndex = highScores.findIndex(score => score.nickName === newScoreEntity.nickName)

  // findIndex will return -1 if user don't have an exisiting score
  if (userIndex !== -1) {
    if (newScoreEntity.score < highScores[userIndex].score) {
      highScores[userIndex].score = newScoreEntity.score
      highScores[userIndex].date = newScoreEntity.date
    }
  } else {
    highScores.push(newScoreEntity)
  }

  highScores.sort((a, b) => a.score - b.score)
  highScores.splice(5)

  localStorage.setItem('sy222ea_HighScores', JSON.stringify(highScores))
}

/**
 *
 * @returns {Array} array of saved scores if there is one, else []
 */
export function loadScores () {
  const savedScores = localStorage.getItem('sy222ea_HighScores')

  if (savedScores) {
    return JSON.parse(savedScores)
  }
  return []
}
