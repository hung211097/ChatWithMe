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
