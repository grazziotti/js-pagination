const data = Array.from({length: 100})
.map((_, i) => `Item ${(i + 1)}`)


// ================================================ //


const html = {
    get(element) {
        return document.querySelector(element)
    }
}

let perPage = 5
const state = {
    page: 1,
    perPage,
    totalPage: Math.ceil(data.length / perPage),
    maxVisibleButtons: 5
}

const controls = {
    next() {
        state.page++

        if (state.page > state.totalPage) state.page-- 
    },
    prev() {
        state.page--

        if (state.page < 1) state.page++
    },
    goTo(page) {
        if (page > state.totalPage) page = state.totalPage
        if (page < 1) page = 1

        state.page = +page
    },
    createListeners() {
        html.get('.first').addEventListener('click', () => {
            this.goTo(1)
            update()
        })

        html.get('.last').addEventListener('click', () => {
            this.goTo(state.totalPage)
            update()
        })

        html.get('.next').addEventListener('click', () => {
            this.next()
            update()
        })

        html.get('.prev').addEventListener('click', () => {
            this.prev()
            update()
        })
    }
}

const list = {
    create(item) {
        const div = document.createElement('div')
        div.classList.add('item')
        div.innerHTML = item

        html.get('.list').appendChild(div)
    },
    update() {
        html.get('.list').innerHTML = ''

        let page = state.page - 1
        let start = page * state.perPage
        let end = start + state.perPage

        const paginateItems = data.slice(start, end)

        paginateItems.forEach(this.create)
    }
}

const buttons = {
    element: html.get('.controls .numbers'),
    create(number) {

        const button = document.createElement('div')

        button.innerHTML = number
        
        if (state.page == number) button.classList.add('active')

        button.addEventListener('click', (e) => {
            controls.goTo(e.target.innerHTML)
            update()
        })

        this.element.appendChild(button)
    },
    update() {
        this.element.innerHTML = ''

        const { maxLeft, maxRight } = this.calculateMaxVisible()

        for (let page = maxLeft; page <= maxRight; page++) {
            this.create(page)
        }
    },
    calculateMaxVisible() {
        const { maxVisibleButtons } = state

        let maxLeft = (state.page - Math.floor(maxVisibleButtons / 2))
        let maxRight = (state.page + Math.floor(maxVisibleButtons / 2))
        
        if (maxLeft < 1) {
            maxLeft = 1
            maxRight = maxVisibleButtons
        }


        if (maxRight > state.totalPage) {
            maxLeft = state.totalPage - (maxVisibleButtons - 1)
            maxRight = state.totalPage
            if (maxLeft < 1) maxLeft = 1
        }

        return { maxLeft, maxRight }
    }

}

function update() {
    list.update()
    buttons.update()
}

function init() {
    update()
    controls.createListeners()
}

init()
