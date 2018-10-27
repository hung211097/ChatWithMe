export function ResultifyData(obj, key){
  if(!key){
    return null
  }
  return obj._document.data.internalValue.get(key).internalValue;
}
