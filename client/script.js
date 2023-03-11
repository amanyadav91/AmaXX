import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadIntervel;
function loader(element) {
    element.textContent = '';

    loadIntervel = setInterval(
        () => {
            element.textContent += '.';

            if (element.textContent === '....')
                element.textContent = '';
        }, 300)
}
function typeText(element, text) {
    let index = 0;
    {
        let interval = setInterval(() => {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
            }
            else {
                clearInterval(interval)
            }
        }, 20)
    }
}
function genrateUniqueID() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return 'id-${timestamp}-${hexadecimalString}';
}

function chatSripe(isAi, value, uniqueId) {
    return (
        `

    <div class="wrapper ${isAi && 'ai'}">
    <div class="chat">
    <div class="profile">
    <img
    src="${isAi ? bot : user}"
    alt=${isAi ? 'bot' : 'user'}"
    />
    </div>
    <div class="masssage" id=${uniqueId}>${value}</div>
    </div>
    </div>
   
    `
    )
}
const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    //user chat stripe 
    chatContainer.innerHTML += chatSripe(false, data.get('prompt'));

    form.reset();
    //bot chatstripe 
    const uniqueId = genrateUniqueID();

    chatContainer.innerHTML += chatSripe(true, "", uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const masssageDiv = document.getElementById(uniqueId);

    loader(masssageDiv);

    //fatch data from server --> bot's response

    const response = await fatch('https://amaxx.onrender.com',{
        method:"POST",
        headers:{
            'Content-Type': 'appliction/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })
    clearInterval(loadIntervel);
    masssageDiv.innerHTML = '';

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();
        console.log({parsedData})
        typeText(masssageDiv, parsedData);
    } else {
        const err = await response.text();

        masssageDiv.innerHTML = "Daya,Kuch To Gadbad hai!!";

        alert(err);
    }
}
form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.keyCode == 13) {
        handleSubmit(e);
    }
})
