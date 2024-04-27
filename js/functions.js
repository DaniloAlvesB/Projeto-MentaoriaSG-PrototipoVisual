function is_mobile(){
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
    }
    return false
}
const mobile = is_mobile()

function update_buttons(){
    var buttons = document.querySelectorAll('.c-circular-progress')
    buttons = [].slice.call(buttons)

    buttons.forEach(el => {
        
        var btn = el
        var porcent = parseInt(btn.getAttribute('data-percent'))
        var deg = 90 + (3.6 * porcent)

        var direction = porcent < 51 ? 'right' : 'left'
        var color = porcent < 51 ? 'rgb(240, 240, 240)' : 'rgb(96, 165, 255)'

        btn.style.background = `
            linear-gradient(
                to ${direction}, 
                ${color} 50%,
                transparent 50%
            ),
            linear-gradient(
                ${deg}deg,
                rgb(96, 165, 255) 50%,
                rgb(240, 240, 240) 50%
            )
        `

        var childrems = btn.childNodes
        childrems.forEach(el => {
            if(el.id != 'percent'){
                el.parentNode.removeChild(el)
            }
        })

        var child = btn.childNodes[0]
        child.id = 'percent'
        child.innerText = porcent + "%"
        
        var div = document.createElement("div");
        btn.appendChild(div)
        div.style.fontWeight = "bold"
        div.innerText = btn.id

    })
}
update_buttons()

function alter_topic_complete(step, topic){

    var act_step = db[step]
    var act_topic = act_step.topics[topic]

    if(!act_topic.concluded){
        act_topic.concluded = true
        act_step.porcent += parseInt(100 /  Object.keys(db[step].topics).length)

        var item = document.getElementById(act_step.item_id)
        item.setAttribute('data-percent', act_step.porcent)

        load_items()
        update_buttons()

    }

}

//Configurando itens
var modal = document.getElementById('itemModal')
var itemCont = document.getElementById('item_content')
var bgModal = document.getElementById('fundo-modal')
var dms_modal = document.getElementById('btn-dms-modal')
modal.style.display = 'none'

function load_items(){
    itemCont.innerText = ''
    modal.style.display = ''

    var title = document.createElement('h2')
    title.innerText = item.name + ' ' + item.porcent + '%'

    var summary = document.createElement('p')
    summary.innerText = item.summary

    var topics = document.createElement('div')
    topics.id = 'topics'
    if(mobile){
        topics.style.maxHeight = '37vh'
    }else{
        topics.style.maxHeight = '50vh'
    }

    var index = 0
    for(t in item.topics){

        index++
        var topic = item.topics[t]
        var topicEx = document.createElement('div')

        topicEx.classList.add('topic')
        topicEx.id = 'topic-' + t

        var text = document.createElement('div')
        text.innerText = index + ' - ' + topic.name

        var status = document.createElement('img')
        if(topic.concluded){
            status.src = './images/icons/complete.png'
            status.alt = 'Item completo'
        }else{
            status.src = './images/icons/not_complete.png'
            status.alt = 'Item incompleto'
        }
        status.style.height = '17px'
        status.style.marginRight = '17px'

        topicEx.appendChild(status)
        topicEx.appendChild(text)
        topics.appendChild(topicEx)
        
    }

    itemCont.appendChild(title)
    itemCont.appendChild(summary)
    itemCont.appendChild(topics)

    var topic_list = document.querySelectorAll('.topic')
    topic_list = [].slice.call(topic_list)
    topic_list.forEach((el) => {
        el.addEventListener('click', (e) => {
            alter_topic_complete(i, el.id.replace('topic-', ''))
        })
    })
}

for(i in db){
    
    var item = db[i]
    var element = document.getElementById(item.item_id)

    element.addEventListener('click', (e) => {load_items()})

}


dms_modal.addEventListener('click', (e) => {
    modal.style.display = 'none'
    itemCont.innerHTML = ''
})