import axios from 'axios'
import sortBy from 'lodash/sortBy'

const grid = document.getElementById('grid')
const sort = document.getElementById('sort')
const { data: items } = await axios.get('/listings.json')

function render() {
  grid.innerHTML = ''
  for (const item of sortBy(items, sort.value)) {
    const li = document.createElement('li')
    li.style.setProperty('--tint', item.tint)
    li.innerHTML = `<div class="thumb">${item.emoji}</div><h2></h2><p class="meta"></p><b>RM${item.price}</b>`
    li.querySelector('h2').textContent = item.name
    li.querySelector('.meta').textContent = `${item.seller} · ${item.place}`
    grid.append(li)
  }
}

sort.addEventListener('change', render)
render()
