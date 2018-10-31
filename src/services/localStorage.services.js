export function saveItem(key, value){
  window.localStorage.setItem(key, value)
}

export function loadItem(key){
  let res = window.localStorage.getItem(key)
  if(key === 'account_status'){
    return res ? res : 'unlogged'
  }
  return res
}
