/**
 * saves current user name to local web storage
 * @param {string} userName
 */
export function saveUserName(userName) {
  localStorage.setItem('sy222ea_UserName', userName);
}

export function loadUserName() {
  return localStorage.getItem('sy222ea_UserName') || '';
}

export function saveMessages(messagesArray) {
  localStorage.setItem('sy222ea_Messages', JSON.stringify(messagesArray));
}

export function loadMessages() {
  const messages = localStorage.getItem('sy222ea_Messages');
  if (messages) {
    return JSON.parse(messages);
  } else {
    return [];
  }
}



