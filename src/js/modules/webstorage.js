/**
 * saves current user name to local web storage
 * @param {string} userName - the user name to save
 */
export function saveUserName (userName) {
  localStorage.setItem('sy222ea_UserName', userName)
}

/**
 * loads current user name from local web storage
 * @returns {string} the user name from local web storage
 */
export function loadUserName () {
  return localStorage.getItem('sy222ea_UserName') || ''
}
/**
 * saves messages to local web storage
 * @param {Array} messagesArray - the messages to save
 */
export function saveMessages (messagesArray) {
  localStorage.setItem('sy222ea_Messages', JSON.stringify(messagesArray))
}

/**
 * loads messages from local web storage
 * @returns {Array} the messages from local web storage
 */
export function loadMessages () {
  const messages = localStorage.getItem('sy222ea_Messages')
  if (messages) {
    return JSON.parse(messages)
  } else {
    return []
  }
}
