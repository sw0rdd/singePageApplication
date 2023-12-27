/**
 * User class
 */
export class User {
  #nickName = ''
  #startTime = null

  constructor (nickNme) {
    this.#nickName = nickNme
  }

  getNickName () {
    return this.#nickName
  }

  /**
   * start user quiz timer i.e. whole quiz timer
   */
  startUserQuizTimer () {
    this.#startTime = Date.now()
  }

  /**
   * ends the user quiz timer
   * @returns {number} total time it took the user to finish the quiz
   */
  endUserQuizTimer () {
    const endTime = Date.now()
    const totalTime = (endTime - this.#startTime) / 1000

    // reest
    this.#startTime = null

    return totalTime
  }
}
