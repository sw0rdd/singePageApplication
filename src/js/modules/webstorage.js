/**
 * saves current user name to local web storage
 * @param {string} userName
 */
export function saveUserName(userName) {
  localStorage.setItem('sy222ea_UserName', userName);
}

/**
 * loads the saved user name from local web storage
 * @returns {string} the saved user name if it exists, else an empty string
 */
export function loadUserName() {
  return localStorage.getItem('sy222ea_UserName') || '';
}

