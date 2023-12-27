/**
 * Module to handle fetch get and post requests
 */

/**
 * make fetch get request
 * @param {string} url to send request to
 * @returns {object} JSON resonse object
 */
export async function get (url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`ERROR: ${error}`)
  }
}

/**
 * make fetch post request
 * @param {string} url to send request to
 * @param {object} body has property 'answer' and value: userAnswer
 * @returns {object} JSON response object
 */
export async function post (url, body = null) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }

  try {
    const response = await fetch(url, options)
    const data = await response.json()

    return {
      ok: response.ok, ...data
    }
  } catch (error) {
    console.error(`ERROR: ${error}`)
    throw error
  }
}
