import * as _ from 'lodash'

export function filtersPosts(arr, value) {
	value = value.trim()
	if (value === '') {
		return arr
	} else {
		const resultFilter = _.filter(arr, function(item) {
			return item.title.toLowerCase().includes(value.toLowerCase())
        })
        return resultFilter
	}
}

