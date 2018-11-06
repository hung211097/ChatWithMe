import {accountStatus} from '../constants/localStorage'

export function saveItem(key, value){
  window.localStorage.setItem(key, value)
}

export function loadItem(key){
  let res = localStorage.getItem(key)
  if(key === 'account_status'){
    return res ? res : accountStatus.UNLOGGED
  }
  return res
}
