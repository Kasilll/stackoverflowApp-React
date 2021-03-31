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
	const [ loaded, setLoaded ] = React.useState(false)
	const [ renderData, setRenderData ] = React.useState([])

	React.useEffect(() => {
		// Получение данных
		fetch('https://api.stackexchange.com/2.2/search?intitle=react&site=stackoverflow')
			.then((post) => post.json())
			.then((post) => {
				const dataPosts = post.items.filter((el) => {
					return el.is_answered && el.owner.reputation >= 50 // фильтруем нужные данные
				})
				setData(dataPosts)
				setLoaded(true) // устанавливаем флаг true, после получения постов
			})
			.catch((r) => console.log(r))
	}, [])

	React.useEffect(
		// меняем текст кнопки в зависимости от значения переключателя
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
			if (loaded) {
				setRenderData([ ...filtersPosts(data, inputValue) ]) 
			}
		},
		[ inputValue, loaded, data ]
	) // так же если мы будет набирать текст, то будет происходить фильтрация

	const handlerOnChange = (e) => {
		setInputValue(e.target.value)
	}

	const handlerOnckicksort = () => {
		const sort = _.sortBy(data, function(item) {
			// сортируем по возрастанию
			return item.creation_date
		})
		if (!sortSwitch) {
			// если перекоючаталь true отправляем в состояния рендера массив по возрастанию
			setRenderData(sort)
		} else {
			setRenderData(_.reverse(sort)) // иначе переворачиваем его
		}
		setSortSwitch(!sortSwitch) // после нажатия меняем флаг сортировки
	}

	return (
		<div>
			<Button className="sort-btn" onClick={handlerOnckicksort} variant="contained" color="primary" style={{fontSize: 'calc(6px + 6 * (100vw/1800))'}}>
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
					{!loaded ? (
						<div className="container__loading">Loading...</div>
					) : (
						renderData.map( el => (
							<Post
								key={el.question_id}
								title={el.title}
								link={el.link}
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
