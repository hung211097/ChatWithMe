import {formatDistance, compareDesc} from 'date-fns'
import locale from 'date-fns/locale/vi'
import format from 'date-fns/format'
import isImageUrl from'is-image-url';

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
  let regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  let arrLink = []
  let match = null
  while((match = regex.exec(htmlText)) !== null){
    arrLink.push({url: match[0], isImage: false})
  }

  if(!arrLink.length){
    return htmlText
  }

  arrLink.forEach((item) => {
    if(isImageUrl(item.url)){
      item.isImage = true
    }
  })

  arrLink.forEach((item) => {
    if(item.isImage){
      htmlText = htmlText.replace(item.url, `<a href="${item.url}"><img src="${item.url}" alt="message-img"/></a>`)
    }
    else{
      htmlText = htmlText.replace(item.url, `<a href="${item.url}" target="_blank">${item.url}</a>`)
    }
  })
  return htmlText
}
