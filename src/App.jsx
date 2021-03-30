import React from 'react'
import Post from './component/Post'
import './scss/App.scss'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import { filtersPosts } from './shared/utils'
import * as _ from 'lodash'

function App() {
	const [ data, setData ] = React.useState([])
	const [ sortSwitch, setSortSwitch ] = React.useState(false)
	const [ sortValue, setSortValue ] = React.useState('По возрастанию')
	const [ inputValue, setInputValue ] = React.useState('')
	const [ loading, setLoading ] = React.useState(false)
	const [ renderData, setRenderData ] = React.useState([])

	React.useEffect(() => {
		// Получение данных
		fetch('https://api.stackexchange.com/2.2/search?intitle=react&site=stackoverflow')
			.then((post) => post.json())
			.then((post) => {
				post.items.forEach((el) => {
					if (el.is_answered && el.owner.reputation >= 50) {
						setData((prev) => [ ...prev, el ])
					}
				})
				setLoading(true) // устанавливаем флаг true, после получения постов
			})
			.catch((r) => console.log(r))
	}, [])

	React.useEffect(
		// меняем текст кнопки в зависимости от переменной
		() => {
			if (!sortSwitch) 
				setSortValue('По возрастанию')
			else 
				setSortValue('По убыванию')
		},
		[ sortSwitch ]
	)

	React.useEffect(
		() => {
			// после загрузки данных добавлем их в массив, который будет рендериться
			if (loading) {
				setRenderData([ ...filtersPosts(data, inputValue) ])
			}
		},
		[ inputValue, loading, data ]
	) // так же если мы будет набирать текст, то будет происходить фильтрация

	const handlerOnChange = (e) => {
		setInputValue(e.target.value)
	}

	const sort = () => {
		const sort = _.sortBy(data, function(item) {
			// сортируем по возрастанию
			return item.creation_date
		})
		if (!sortSwitch) {
			// если перекоючаталь true отправляем в состояния рендера массив по возрастанию
			setRenderData(sort)
		} else {
			setRenderData(_.reverse(sort))
		}
		setSortSwitch(!sortSwitch) // после нажатия меняем флаг сортировки
	}

	return (
		<div>
			<Button className="sort-btn" onClick={sort} variant="contained" color="primary">
				{sortValue}
			</Button>
			<div className="container">
				<Input
					className="container__input"
					onChange={handlerOnChange}
					value={inputValue}
					placeholder="Search"
					inputProps={{ 'aria-label': 'description' }}
				/>
				<div className="container__post">
					{!loading ? (
						<div className="container__loading">Loading...</div>
					) : (
						renderData.map((el, ind) => (
							<Post
								key={`${ind}_${el.creation_date}`}
								title={el.title}
								link={el.owner.link}
								avatar={el.owner.profile_image}
							/>
						))
					)}
				</div>
			</div>
		</div>
	)
}

export default App
