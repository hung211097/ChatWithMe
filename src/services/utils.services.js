import {formatDistance, compareDesc} from 'date-fns'
import locale from 'date-fns/locale/vi'
import format from 'date-fns/format'

export function fromNowTimeStamp(timestamp) {
  let date = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp)
	return formatDistance(new Date(date), new Date(), {addSuffix: true, locale: locale})
}

export function validateEmail(email){
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function connectStringID(string1, string2){
  if(string1 < string2){
    return string1 + string2;
  }
  return string2 + string1;
}

export function formatDate(date, name='DD/MM/YYYY') {
	return format(new Date(date), name, {locale: locale})
}

export function compareDateReverse(dateLeft, dateRight){
  return compareDesc(new Date(dateLeft), new Date(dateRight))
}

export function transferToImage(htmlText){
  let regex = /<a\s+(?:[^>]*?\s+)?href="([^"]+\?[^"]+)/g
  let arrLink = []
  let match = null
  while((match = regex.exec(htmlText)) !== null){
    arrLink.push({url: match[0], isImage: false})
  }
  console.log(htmlText);
  // console.log(arrLink);
  if(!arrLink.length){
    return htmlText
  }

  for(let i = 0; i < arrLink.length; i++){
    arrLink[i].url = arrLink[i].url.replace(`<a href="`, '')
  }
  console.log(arrLink);

  arrLink.forEach((item) => {
    if(detectImageLink(item.url)){
      item.isImage = true
    }
  })

  let arrTagA = []
  match = null
  let regexSecond = /<a[\s]+([^>]+)>((?:.(?!\<\/a\>))*.)<\/a>/g
  while((match = regexSecond.exec(htmlText)) !== null){
    arrTagA.push(match[0])
  }

  arrTagA.forEach((item, key) => {
    if(arrLink[key].isImage){
      htmlText = htmlText.replace(item, `<img src="${arrLink[key].url}" alt="message-img"/>`)
    }
  })

  return htmlText
}

function detectImageLink(string){
  let regex = /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/gi
  if(regex.test(string)){
    return true
  }
  return false
}
