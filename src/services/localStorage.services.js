export function saveItem(key, value){
  window.localStorage.setItem(key, value)
}

export function loadItem(key){
  return window.localStorage.getItem(key)
}
